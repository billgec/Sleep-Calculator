import { LegalPage } from '../components/LegalPage.tsx'
import { OperatorAddress } from '../components/OperatorAddress.tsx'
import { LAST_UPDATED } from '../legal.ts'

const DSB_URL = 'https://www.dsb.gv.at'
const GITHUB_PRIVACY_URL =
  'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement'

export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy policy">
      <h2>Controller</h2>
      <p>The person responsible for data processing on this website is:</p>
      <OperatorAddress />

      <h2>Summary</h2>
      <p>
        Sleep Calculator runs entirely in your browser. The times you enter
        are never sent to a server. This website uses no cookies, no
        analytics or tracking, and loads no external fonts, scripts or other
        resources.
      </p>

      <h2>Local storage</h2>
      <p>
        To save you from entering them again, your last wake-up time, mode
        and fall-asleep time are saved in your browser&apos;s local storage.
        This data stays on your device, is never transmitted and contains no
        personal information. You can delete it at any time by clearing your
        browser&apos;s site data. Storing these settings is necessary to
        provide the function you use (§ 165 (3) TKG 2021).
      </p>

      <h2>Hosting by GitHub Pages</h2>
      <p>
        This website is hosted on GitHub Pages, a service of GitHub, Inc., 88
        Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. When you
        visit the website, GitHub processes technical data such as your IP
        address, the date and time of the request and your browser
        information in server logs. This is necessary to deliver the website
        and to keep it secure.
      </p>
      <p>
        The legal basis is our legitimate interest in a secure and reliable
        website (Art. 6(1)(f) GDPR). Data may be processed in the USA. GitHub
        is certified under the EU-U.S. Data Privacy Framework. For details,
        see the{' '}
        <a href={GITHUB_PRIVACY_URL} target="_blank" rel="noreferrer">
          GitHub General Privacy Statement
        </a>
        .
      </p>

      <h2>Contact by email</h2>
      <p>
        If you contact us by email, your email address and message are used
        only to answer your request and are deleted once it is resolved
        (Art. 6(1)(f) GDPR).
      </p>

      <h2>Your rights</h2>
      <p>Under the GDPR you have the right to:</p>
      <ul>
        <li>access your personal data (Art. 15)</li>
        <li>have incorrect data corrected (Art. 16)</li>
        <li>have your data deleted (Art. 17)</li>
        <li>restrict processing (Art. 18)</li>
        <li>receive your data in a portable format (Art. 20)</li>
        <li>object to processing based on legitimate interests (Art. 21)</li>
        <li>lodge a complaint with a data protection supervisory authority (Art. 77)</li>
      </ul>
      <p>To exercise these rights, send an email to the address above.</p>
      <p>
        The competent supervisory authority in Austria is the{' '}
        <a href={DSB_URL} target="_blank" rel="noreferrer">
          Austrian Data Protection Authority (Datenschutzbehörde)
        </a>
        , Barichgasse 40–42, 1030 Vienna.
      </p>

      <p className="updated">Last updated: {LAST_UPDATED}</p>
    </LegalPage>
  )
}
