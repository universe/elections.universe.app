import React, { useState } from 'react';
import './SocialSubmitForm.css';

const FB_SHARE_URL = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Felections.universe.app%2F06%2F75%2F2020P';
const TWITTER_SHARE_URL = 'https://twitter.com/intent/tweet?hashtags=universeapp&related=universeapp&text=Local%20politics%20matter&url=https%3A%2F%2Felections.universe.app%2F06%2F75%2F2020P';

type Props = {
  showSocialBar: boolean,
}

const SocialSubmitForm = ({ showSocialBar }: Props) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    window.fetch(form.action, {
      method: form.method,
      headers: headers,
      body: JSON.stringify(data),
    });
    setSubmitted(true);
  };

  const formClassNames = 'email-form' + (submitted ? ' submitted' : '');
  return (
    <section id="social-bar" className={`${showSocialBar ? 'open' : ''} social-bar`}>
      <label className="map__filter-label map__social-label" htmlFor="email-input">
        <span className="sectionTitle">Stay up to date on local elections:</span>
        <a href={FB_SHARE_URL} id="fb-share" className="fb-btn">Share</a>
        <a href={TWITTER_SHARE_URL} id='twtr-share' className="twtr-btn">Tweet</a>
      </label>
      <form onSubmit={handleSubmit}
        className={formClassNames} id='email-form' target="_blank" method="POST" action="https://api.universe.app/v1/email/subscribe">
          <label className="email-form__success">Thanks for subscribing!</label>
          <input type='text' placeholder="First Name" name="FNAME" className="email-form__name-input" />
          <input type='text' placeholder="Last Name" name="LNAME" className="email-form__name-input" />
          <input type='email' placeholder="Email" name="EMAIL" id="email-input" className="email-form__input" />
          <button type='submit' className='email-form__submit' form='email-form'> Submit</button>
          <input type='hidden' name='u' value='6b56ce91de42db2930dd99758' />
          <input type='hidden' name='id' value='74b5983973' />
          <input type="hidden" name="redirect" value="https://elections.universe.app/06/75/2020P" />
          <input type="hidden" name="TAGS" value='06_75_2020P' />
      </form>
    </section>
  )
};

export default SocialSubmitForm;