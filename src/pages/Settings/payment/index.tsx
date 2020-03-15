/** @jsx jsx */
import { jsx } from '@emotion/core'
import { CreditCardForm } from 'components/CreditCardForm'
import { ViewerContext } from 'contexts/Viewer'
import { useContext } from 'react'
import { useMachine } from '@xstate/react'
import * as StripeRequester from 'modules/stripe/requester'
import { BasicFormMachine } from './BasicFormMachine'

export function PaymentSetting() {
  const { viewer } = useContext(ViewerContext)

  const [, send] = useMachine(BasicFormMachine, {
    actions: {
      notifySuccess: () => {
        console.log('success!')
      },
    },
    services: {
      updateCreditCard: async (_, e) => {
        const { token } = e
        const result = await StripeRequester.changeCreditCard(token, viewer?.getCustomerId() ?? '')
        return result
      },
    },
  })

  const handleSaveCreditCard = async (data: any) => {
    const token = data.id
    send('SUBMIT', { token })
  }
  return <CreditCardForm onSubmit={handleSaveCreditCard} />
}
