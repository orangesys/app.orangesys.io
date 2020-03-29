/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as styles from './style'
import { layoutOffset, layoutMain, MainStyle } from 'styles/layout-center'
import { plans } from 'modules/plan/plans'
import { RouteComponentProps, navigate } from '@reach/router'
import { CircularProgress, Paper } from '@material-ui/core'

import { PlanCard } from 'components/PlanCard'

import { useMachine } from '@xstate/react'
import { OrderPlanMachine } from './OrderPlanMachine'
import { CreditCardForm } from 'components/CreditCardForm'
import * as StripeRequester from 'modules/stripe/requester'
import { UserService } from 'modules/user/user-service'
import { routes } from 'routes'
import { ViewerContext } from 'contexts/Viewer'
import { useContext } from 'react'
import * as OrangesysApi from 'lib/orangesys-api'
import SERVER_SETUP_STATUS from 'const/server-setup-status'
import { formatISO } from 'date-fns'
import { Message } from 'components/Message'

export const OrderPlan = (props: RouteComponentProps) => {
  const userService = new UserService()
  const { viewer, setViewer } = useContext(ViewerContext)

  const [state, send] = useMachine(OrderPlanMachine, {
    actions: {
      goNextPage: context => {
        const { user } = context
        setViewer(user)
        navigate(routes.ServerSetup)
      },
    },

    services: {
      registerPayment: async (_, e) => {
        const { token, user, plan } = e
        const { customerId, subscriptionId } = await StripeRequester.registerCustomer(
          token,
          plan.id,
          user.uid,
          user.email,
        )

        const updatedUser = await userService.savePaymentInformation(user.uid, plan.id, customerId, subscriptionId)
        return updatedUser
      },
      requestSetupServer: async (context, e) => {
        const { user, plan } = context
        const uid = user.getId()
        // @ts-ignore
        const { retention } = plan
        if (!retention) {
          throw new Error('plan is invalid')
        }

        try {
          const apiClient = new OrangesysApi.Client({})
          await apiClient.createServer(retention, uid)
          const user = await userService.updateServerSetupStatus(uid, {
            status: SERVER_SETUP_STATUS.BUILDING,
            startedAt: formatISO(new Date()),
          })
          setViewer(user)
        } catch (error) {
          const errorCode = 'creation_request_error'
          const errorMessage = error.toString()
          const user = await userService.updateServerSetupStatus(uid, {
            status: SERVER_SETUP_STATUS.ERRORED,
            errorCode,
            errorMessage,
          })
          setViewer(user)
          throw errorCode
        }
      },
    },
  })

  const onSubmit = (data: any) => {
    const { plan } = state.context

    send('SUBMIT', { token: data.id, user: viewer?.auth, plan })
  }

  return (
    <div css={MainStyle}>
      <div css={layoutOffset}></div>
      <div css={layoutMain}>
        <Paper css={styles.paper}>
          {state.value === 'planList' && (
            <div css={styles.main}>
              <div css={styles.title}>以下よりプランを選択してください</div>
              <div css={styles.list}>
                {Array.from(plans.values()).map(plan => {
                  return (
                    <div key={plan.id} css={styles.planCard} onClick={() => send({ type: 'CHOOSE', data: plan })}>
                      <PlanCard plan={plan} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {state.value === 'cardForm' && (
            <div css={styles.main}>
              {state.context.plan && (
                <div css={styles.planCard} onClick={() => send({ type: 'CHANGE_PLAN' })}>
                  <PlanCard plan={state.context.plan} />
                </div>
              )}

              <div css={styles.creditCardForm}>
                <CreditCardForm onSubmit={onSubmit} />
              </div>
            </div>
          )}
          {state.value === 'loading' && (
            <div css={styles.main}>
              <CircularProgress />
            </div>
          )}
        </Paper>
      </div>

      <div css={layoutOffset}></div>
      {/* FIXME: add failure state */}
      <Message open={!!state?.context?.error} message={state?.context?.error?.code} type="error" />
    </div>
  )
}
