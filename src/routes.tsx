import React from 'react'
import { Router, RouteComponentProps } from './lib/router'
import { SignUp } from 'pages/SignUp'
import { SignIn } from 'pages/SignIn'
import { VerificationGuide } from 'pages/VerificationGuide'
import { OrderPlan } from 'pages/OrderPlan'
import { Authorized } from 'pages/Authorized'
import { DashBoard } from 'pages/DashBoard'
import { ServerSetup } from 'pages/ServerSetup'
import { BaseInfo } from 'pages/BaseInformation'
// import { Redirect } from '@reach/router'

const NotFound = (props: RouteComponentProps) => <div>404</div>

export const routes = {
  SignUp: 'sign-up',
  BaseInfo: '/base-info',
  VerificationGuide: '/verification-guide',
  SignIn: '/sign-in',
  OrderPlan: '/order-plan',
  ServerSetup: '/server-setup',
  Setting: '/setting',
  DashBoard: '/',
  DashBoardGraph: '/graph',
  DashBoardDB: '/db',
  DashBoardInquiry: '/inquiry',
  DashBoardPlan: '/plan',
}
export const routeTitles = {
  [routes.DashBoard]: 'ホーム',
  [routes.VerificationGuide]: 'メールアドレスの認証',
  [routes.OrderPlan]: 'プランの選択',
  [routes.ServerSetup]: 'サーバーセットアップ',
  [routes.Setting]: '設定',
  [routes.DashBoardGraph]: 'Graph',
  [routes.DashBoardDB]: 'TSDB',
  [routes.DashBoardInquiry]: 'お問い合わせ',
  [routes.DashBoardPlan]: 'プラン',
}

export const Routes = () => {
  return (
    <Router>
      <Authorized path="/">
        <DashBoard path={routes.DashBoard} />
        <BaseInfo path={routes.BaseInfo} />
        <VerificationGuide path={routes.VerificationGuide} />
        <OrderPlan path={routes.OrderPlan} />
        <ServerSetup path={routes.ServerSetup} />

        <NotFound default />
      </Authorized>

      <SignIn path={routes.SignIn} />
      <SignUp path={routes.SignUp} />

      <NotFound default />
    </Router>
  )
}
