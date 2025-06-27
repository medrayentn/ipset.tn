/**
 * PHP Email Form Validation - v3.9
 */
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if (!action) {
        displayError(thisForm, 'L\'action du formulaire n\'est pas définie!');
        return;
      }

      let requiredFields = thisForm.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'red';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!isValid) {
        displayError(thisForm, 'Veuillez remplir tous les champs obligatoires.');
        return;
      }

      const loadingEl = thisForm.querySelector('.loading');
      const errorEl = thisForm.querySelector('.error-message');
      const sentEl = thisForm.querySelector('.sent-message');
      if (loadingEl) loadingEl.classList.add('d-block');
      if (errorEl) errorEl.classList.remove('d-block');
      if (sentEl) sentEl.classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, 'Erreur reCAPTCHA: ' + error);
            }
          });
        } else {
          displayError(thisForm, 'L\'API reCAPTCHA n\'est pas chargée!');
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    const params = new URLSearchParams();
    for (const pair of formData) {
        params.append(pair[0], pair[1]);
    }

    fetch(action, {
        method: 'POST',
        body: params,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url;
        return;
      } else if (response.ok) {
        return response.text();
      } else {
        return response.text().then(text => {
          throw new Error(text || `Erreur ${response.status}: ${response.statusText}`);
        });
      }
    })
    .then(data => {
      const loadingEl = thisForm.querySelector('.loading');
      if (loadingEl) loadingEl.classList.remove('d-block');
      if (data && data.trim() === 'OK') {
        const sentEl = thisForm.querySelector('.sent-message');
        if (sentEl) sentEl.classList.add('d-block');
        thisForm.reset();
      } 
      // else {
      //   throw new Error(data || 'L\'envoi du formulaire a échoué sans message d\'erreur.');
      // }
    })
    .catch((error) => {
      const loadingEl = thisForm.querySelector('.loading');
      if (loadingEl) loadingEl.classList.remove('d-block');
      console.log("Fetch error:", error.message); // Debug log
      displayError(thisForm, error.message || 'Une erreur inconnue est survenue.');
    });
  }

  function displayError(thisForm, error) {
    const loadingEl = thisForm.querySelector('.loading');
    const errorEl = thisForm.querySelector('.error-message');
    if (loadingEl) loadingEl.classList.remove('d-block');
    if (errorEl) {
      errorEl.innerHTML = error;
      errorEl.classList.add('d-block');
      errorEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
})();