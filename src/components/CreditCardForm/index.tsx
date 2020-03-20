/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useState } from 'react'

import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { stripePromise } from 'lib/stripe'
import './style.css'
import * as styles from './style'
import { Button } from '@material-ui/core'

// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

const CheckoutForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [error, setError] = useState()
  const stripe = useStripe()
  const elements = useElements()

  // Handle real-time validation errors from the card Element.
  const handleChange = (event: any) => {
    if (event.error) {
      setError(event.error.code)
    } else {
      setError(null)
    }
  }

  // Handle form submission.
  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (elements && stripe) {
      const card = elements.getElement(CardElement)
      if (card) {
        const result = await stripe.createToken(card)
        if (result.error) {
          // Inform the user if there was an error.
          setError(result?.error?.message)
        } else {
          setError(null)
          // Send the token to your server.
          // stripeTokenHandler(result.token)
          onSubmit(result?.token)
        }
      }
    }
  }

  return (
    <form css={styles.form} onSubmit={handleSubmit}>
      <div css={styles.field}>
        <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
        <div role="alert">{error}</div>
      </div>
      <div css={styles.submit}>
        <Button variant="contained" color="primary" fullWidth type="submit">
          Submit Payment
        </Button>
      </div>
    </form>
  )
}

export const CreditCardForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onSubmit={onSubmit} />
    </Elements>
  )
}
