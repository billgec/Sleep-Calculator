import { operator } from '../legal.ts'

export function OperatorAddress() {
  return (
    <address>
      {operator.name}
      <br />
      {operator.city}, {operator.country}
      <br />
      Email: <a href={`mailto:${operator.email}`}>{operator.email}</a>
    </address>
  )
}
