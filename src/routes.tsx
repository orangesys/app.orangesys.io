import React, { Suspense } from 'react'
import { Router } from '@reach/router'

import { Loading } from 'components/Loading'
import NotFound from 'pages/NotFound'

const SignIn = React.lazy(() => import('pages/SignIn'))
const SignUp = React.lazy(() => import('pages/SignUp'))
const Authorized = React.lazy(() => import('pages/Authorized'))

const VerificationGuide = React.lazy(() => import('pages/VerificationGuide'))

const Plan = React.lazy(() => import('pages/Plan'))
const Settings = React.lazy(() => import('pages/Settings'))
const ServerSetup = React.lazy(() => import('pages/ServerSetup'))
const BaseInfo = React.lazy(() => import('pages/BaseInfo'))
const OrderPlan = React.lazy(() => import('pages/OrderPlan'))

const DashBoard = React.lazy(() => import('pages/DashBoard'))
const Graph = React.lazy(() => import('pages/DashBoard/Graph'))
const DB = React.lazy(() => import('pages/DashBoard/DB'))

export const routes = {
  SignUp: 'sign-up',
  BaseInfo: '/base-info',
  VerificationGuide: '/verification-guide',
  SignIn: '/sign-in',
  OrderPlan: '/order-plan',
  ServerSetup: '/server-setup',
  Settings: '/settings',
  DashBoard: '/',
  DashBoardGraph: '/graph',
  DashBoardDB: '/db',
  DashBoardInquiry: '/inquiry',
  DashBoardPlan: '/plan',
}
export const routeTitles = {
  [routes.BaseInfo]: '基本情報',
  [routes.DashBoard]: 'ホーム',
  [routes.VerificationGuide]: 'メールアドレスの認証',
  [routes.OrderPlan]: 'プランの選択',
  [routes.ServerSetup]: 'サーバーセットアップ',
  [routes.Settings]: '設定',
  [routes.DashBoardGraph]: 'Graph',
  [routes.DashBoardDB]: 'TSDB',
  [routes.DashBoardInquiry]: 'お問い合わせ',
  [routes.DashBoardPlan]: 'プラン',
}

export const Routes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Authorized path="/">
          <DashBoard path={routes.DashBoard} />
          <BaseInfo path={routes.BaseInfo} />
          <VerificationGuide path={routes.VerificationGuide} />
          <OrderPlan path={routes.OrderPlan} />
          <ServerSetup path={routes.ServerSetup} />
          <Plan path={routes.DashBoardPlan} />
          <Graph path={routes.DashBoardGraph} />
          <DB path={routes.DashBoardDB} />
          <Settings path={routes.Settings} />

          <NotFound default />
        </Authorized>

        <SignIn path={routes.SignIn} />
        <SignUp path={routes.SignUp} />

        <NotFound default />
      </Router>
    </Suspense>
  )
}
