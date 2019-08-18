export class User {
  planId: string
  plan: string
  state: boolean
  subDomain: string
  prometheusLabel: string
  telegrafToken: string

  constructor(public uid: string, public email: string, public company: string) {}
}
