import { APP_NAME } from '../brand.ts'
import { LegalPage } from '../components/LegalPage.tsx'
import { OperatorAddress } from '../components/OperatorAddress.tsx'
import { LAST_UPDATED } from '../legal.ts'

export function LegalNotice() {
  return (
    <LegalPage title="Legal notice">
      <h2>Disclosure according to § 25 Austrian Media Act (MedienG)</h2>
      <OperatorAddress />

      <h2>About this project</h2>
      <p>
        {APP_NAME} is a private, non-commercial project. It offers no
        paid services and shows no advertising.
      </p>

      <h2>No medical advice</h2>
      <p>
        The suggested times are based on average 90-minute sleep cycles and
        are for general information only. They do not replace medical advice.
      </p>

      <h2>Liability for links</h2>
      <p>
        This website links to external websites. Their operators are solely
        responsible for their content. No unlawful content was apparent when
        the links were added. If you notice a problem, please get in touch and
        the link will be removed.
      </p>

      <p className="updated">Last updated: {LAST_UPDATED}</p>
    </LegalPage>
  )
}
