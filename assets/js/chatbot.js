document.addEventListener('DOMContentLoaded', () => {
  const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
  const chatbotPopup = document.getElementById('chatbotPopup');
  const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSendBtn = document.getElementById('chatbotSendBtn');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotQuickReplies = document.getElementById('chatbotQuickReplies');

  let lastContext = null;

  const quickReplies = [
    { text: 'Voir formations', action: 'courses' },
    { text: 'S’inscrire', action: 'inscription' },
    { text: 'Connaître les événements', action: 'events' },
    { text: 'Contact IPSET', action: 'contact' }
  ];

  chatbotToggleBtn.addEventListener('click', () => {
    chatbotPopup.classList.toggle('show');
    if (chatbotPopup.classList.contains('show') && !chatbotMessages.hasChildNodes()) {
      showWelcomeMessage();
    }
  });

  chatbotCloseBtn.addEventListener('click', () => {
    chatbotPopup.classList.remove('show');
    lastContext = null;
  });

  chatbotSendBtn.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  chatbotQuickReplies.addEventListener('click', (e) => {
    if (e.target.classList.contains('chatbot-quick-reply-btn')) {
      const action = e.target.dataset.action;
      handleQuickReply(action);
    }
  });

  function showWelcomeMessage() {
    const welcomeMessage = document.createElement('div');
    welcomeMessage.classList.add('message', 'bot-message', 'typing');
    welcomeMessage.innerHTML = '👋 Bonjour, je suis l’IPSET Assistant. Je peux vous aider à :<ul><li>👉 Trouver une formation</li><li>👉 Vous inscrire</li><li>👉 Connaître les événements</li><li>👉 Poser une question générale</li></ul>Que souhaitez-vous faire ?';
    chatbotMessages.appendChild(welcomeMessage);
    
    setTimeout(() => {
      welcomeMessage.classList.remove('typing');
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      quickReplies.forEach(reply => {
        const button = document.createElement('button');
        button.classList.add('chatbot-quick-reply-btn');
        button.textContent = reply.text;
        button.dataset.action = reply.action;
        chatbotQuickReplies.appendChild(button);
      });
    }, 1000);
  }

  function sendMessage() {
    const messageText = chatbotInput.value.trim();
    if (!messageText) return;

    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user-message');
    userMessage.textContent = messageText;
    chatbotMessages.appendChild(userMessage);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    chatbotInput.value = '';
    chatbotQuickReplies.innerHTML = '';

    setTimeout(() => {
      const botMessage = document.createElement('div');
      botMessage.classList.add('message', 'bot-message', 'typing');
      botMessage.innerHTML = getBotResponse(messageText);
      chatbotMessages.appendChild(botMessage);
      setTimeout(() => {
        botMessage.classList.remove('typing');
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        if (!lastContext) {
          quickReplies.forEach(reply => {
            const button = document.createElement('button');
            button.classList.add('chatbot-quick-reply-btn');
            button.textContent = reply.text;
            button.dataset.action = reply.action;
            chatbotQuickReplies.appendChild(button);
          });
        }
      }, 1000);
    }, 500);
  }

  function handleQuickReply(action) {
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user-message');
    const replyText = quickReplies.find(reply => reply.action === action)?.text || 
                     ['Design graphique', 'Comptabilité & Finance', 'Informatique', 'Langues'].find(text => text === action) || action;
    userMessage.textContent = replyText;
    chatbotMessages.appendChild(userMessage);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    chatbotQuickReplies.innerHTML = '';

    setTimeout(() => {
      const botMessage = document.createElement('div');
      botMessage.classList.add('message', 'bot-message', 'typing');
      let response = '';
      if (action === 'courses') {
        lastContext = 'courses';
        response = 'Nous proposons des formations <b>BTS</b>, <b>BTP</b>, <b>CAP</b> (sessions : octobre, mars) en design, comptabilité, informatique, langues, et plus. Consultez <a href="formations-initiales.html" target="_blank">nos formations</a>. Quel domaine vous intéresse ?';
        const courseReplies = [
          { text: 'Design graphique', action: 'Design graphique' },
          { text: 'Comptabilité & Finance', action: 'Comptabilité & Finance' },
          { text: 'Informatique', action: 'Informatique' },
          { text: 'Langues', action: 'Langues' }
        ];
        courseReplies.forEach(reply => {
          const button = document.createElement('button');
          button.classList.add('chatbot-quick-reply-btn');
          button.textContent = reply.text;
          button.dataset.action = reply.action;
          chatbotQuickReplies.appendChild(button);
        });
      } else if (['Design graphique', 'Comptabilité & Finance', 'Informatique', 'Langues'].includes(action)) {
        lastContext = 'course_details';
        response = getBotResponse(action.toLowerCase());
      } else if (action === 'inscription') {
        lastContext = 'inscription';
        response = 'Nos sessions de formation débutent en octobre et mars. Pour vous inscrire, remplissez le formulaire sur <a href="inscription.html" target="_blank">notre page d’inscription</a> ou contactez-nous au <b>+216 54 44 20 95</b>. Besoin d’aide pour choisir une formation ?';
      } else if (action === 'events') {
        lastContext = 'events';
        response = 'Nous organisons des ateliers, séminaires sur les langues, et journées portes ouvertes. Restez informé(e) sur <a href="events.html" target="_blank">nos événements</a>. Détails sur un événement spécifique ?';
      } else if (action === 'contact') {
        lastContext = 'contact';
        response = 'Contactez-nous au <b>+216 54 44 20 95</b>, par email à <b>contact@ipset.tn</b>, ou au <b>04, Rue des Entrepreneurs, Tunis</b>. Plus sur <a href="contact.html" target="_blank">notre page Contact</a>. Besoin d’aide ?';
      }
      botMessage.innerHTML = response;
      chatbotMessages.appendChild(botMessage);
      setTimeout(() => {
        botMessage.classList.remove('typing');
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }, 1000);
    }, 500);
  }

  function getBotResponse(message) {
    const lowerMessage = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (lowerMessage === 'design graphique') {
      return 'Notre formation en <b>Design graphique</b> (sessions : octobre, mars) vous apprend à créer des visuels avec Photoshop et Illustrator. Détails sur <a href="formations-initiales.html" target="_blank">nos formations</a>. Intéressé(e) par la durée ou les certifications ?';
    } else if (lowerMessage === 'comptabilité & finance' || lowerMessage === 'comptabilite & finance') {
      return 'Nos programmes <b>BTS</b> et <b>CAP en Comptabilité & Finance</b> (sessions : octobre, mars), homologués par l’État, préparent à une carrière en gestion financière. Plus sur <a href="formations-initiales.html" target="_blank">nos formations</a>. Questions sur les prérequis ?';
    } else if (lowerMessage === 'informatique') {
      return 'Nos formations en <b>Informatique</b> (sessions : octobre, mars) incluent Informatique de gestion, Microsoft Office, Développement Web, CMS et CISCO. Consultez <a href="formations-initiales.html" target="_blank">nos formations</a>. Quel domaine vous intéresse ?';
    } else if (lowerMessage === 'langues') {
      return 'Nos cours de langues (sessions : octobre, mars), dispensés par des experts, sont adaptés à tous les niveaux. Détails sur <a href="formations-initiales.html" target="_blank">nos formations</a>. Quelle langue vous intéresse ?';
    }

    if (message === 'courses') {
      lastContext = 'courses';
      return 'Nous proposons des formations <b>BTS</b>, <b>BTP</b>, <b>CAP</b> (sessions : octobre, mars) en design, comptabilité, informatique, langues, et plus. Consultez <a href="formations-initiales.html" target="_blank">nos formations</a>. Quel domaine vous intéresse ?';
    }
    if (message === 'inscription') {
      lastContext = 'inscription';
      return 'Nos sessions de formation débutent en octobre et mars. Pour vous inscrire, remplissez le formulaire sur <a href="inscription.html" target="_blank">notre page d’inscription</a> ou contactez-nous au <b>+216 54 44 20 95</b>. Besoin d’aide pour choisir une formation ?';
    }
    if (message === 'events') {
      lastContext = 'events';
      return 'Nous organisons des ateliers, séminaires sur les langues, et journées portes ouvertes. Restez informé(e) sur <a href="events.html" target="_blank">nos événements</a>. Détails sur un événement spécifique ?';
    }
    if (message === 'contact') {
      lastContext = 'contact';
      return 'Contactez-nous au <b>+216 54 44 20 95</b>, par email à <b>contact@ipset.tn</b>, ou au <b>04, Rue des Entrepreneurs, Tunis</b>. Plus sur <a href="contact.html" target="_blank">notre page Contact</a>. Besoin d’aide ?';
    }

    if (lowerMessage.includes('oui') || lowerMessage.includes('bien sur') || lowerMessage.includes('daccord') || lowerMessage.includes('ok')) {
      if (lastContext === 'events') {
        lastContext = 'event_details';
        return 'Super ! Voici quelques événements à venir : <ul><li><b>WAJAHNI Edu-Career Summit</b> (6-7 janvier, Cité de la Culture, Tunis) : un sommet pour l’orientation académique et professionnelle.</li><li><b>Sortie éducative</b> (1er mars 2025) : une expérience culturelle unique.</li></ul>Plus de détails sur <a href="/events.html" target="_blank">nos événements</a>. Quel événement vous intéresse ?';
      } else if (lastContext === 'courses') {
        lastContext = 'course_details';
        return 'D’accord ! Nos formations incluent <b>Design graphique</b>, <b>Comptabilité & Finance</b>, <b>Informatique</b>, <b>Langues</b>, et plus. Consultez la liste sur <a href="formations-initiales.html" target="_blank">nos formations</a>. Quel domaine vous intéresse ?';
      } else if (lastContext === 'inscription') {
        lastContext = 'inscription_details';
        return 'Parfait ! Nos sessions débutent en octobre et mars. Remplissez le formulaire sur <a href="inscription.html" target="_blank">notre page d’inscription</a>. Besoin d’aide pour les démarches ?';
      } else {
        lastContext = null;
        return 'Merci de votre réponse ! Parlez-moi de vos besoins : formations, événements, ou inscriptions ? Contactez-nous au <b>+216 54 44 20 95</b>.';
      }
    }

    if (
      lowerMessage.includes('inscription') ||
      lowerMessage.includes('inscrire') ||
      lowerMessage.includes('s\'inscrire') ||
      lowerMessage.includes('s inscrire') ||
      lowerMessage.includes('enregistrer') ||
      lowerMessage.includes('incrire') ||
      lowerMessage.includes('comment')
    ) {
      lastContext = 'inscription';
      return 'Nos sessions de formation débutent en octobre et mars. Pour vous inscrire, remplissez le formulaire sur <a href="inscription.html" target="_blank">notre page d’inscription</a> ou contactez-nous au <b>+216 54 44 20 95</b> ou à <b>contact@ipset.tn</b>. Besoin d’aide pour choisir une formation ?';
    }

    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      lastContext = 'greeting';
      return '👋 Bonjour, je suis l’IPSET Assistant. Je peux vous aider à :<ul><li>👉 Trouver une formation</li><li>👉 Vous inscrire</li><li>👉 Connaître les événements</li><li>👉 Poser une question générale</li></ul>Que souhaitez-vous faire ?';
    }

    if (lowerMessage.includes('formation') || lowerMessage.includes('cours') || lowerMessage.includes('programme') || lowerMessage.includes('etudier')) {
      lastContext = 'courses';
      return 'Nous proposons des formations <b>BTS</b>, <b>BTP</b>, <b>CAP</b> (sessions : octobre, mars) en design, comptabilité, informatique, langues, et plus. Consultez <a href="formations-initiales.html" target="_blank">nos formations</a>. Quel domaine vous intéresse ?';
    }

    if (lowerMessage.includes('evenement') || lowerMessage.includes('evènement') || lowerMessage.includes('event') || lowerMessage.includes('sortie')) {
      lastContext = 'events';
      return 'Nous organisons des ateliers, séminaires sur les langues, et journées portes ouvertes. Restez informé(e) sur <a href="events.html" target="_blank">nos événements</a>. Détails sur un événement spécifique ?';
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('contacter') || lowerMessage.includes('adresse') || lowerMessage.includes('telephone') || lowerMessage.includes('email')) {
      lastContext = 'contact';
      return 'Contactez-nous au <b>+216 54 44 20 95</b>, par email à <b>contact@ipset.tn</b>, ou au <b>04, Rue des Entrepreneurs, Tunis</b>. Plus sur <a href="contact.html" target="_blank">notre page Contact</a>. Besoin d’aide ?';
    }

    if (lowerMessage.includes('qui') || lowerMessage.includes('ipset') || lowerMessage.includes('a propos') || lowerMessage.includes('about')) {
      lastContext = 'about';
      return 'Fondé en 2015, <b>IPSET</b> est le leader tunisien de la formation professionnelle, agréé par le Ministère. Nos programmes <b>BTS</b>, <b>BTP</b>, <b>CAP</b> offrent un accompagnement personnalisé. En savoir plus sur <a href="about.html" target="_blank">notre histoire</a>. Questions sur nos valeurs ?';
    }

    if (lowerMessage.includes('temoignage') || lowerMessage.includes('avis') || lowerMessage.includes('etudiant') || lowerMessage.includes('opinion')) {
      lastContext = 'testimonials';
      return 'Nos apprenants, comme Motia Mrabet, louent la qualité de nos formations. Lisez leurs avis sur <a href="about.html" target="_blank">notre page À propos</a>. En savoir plus sur leurs expériences ?';
    }

    if (lowerMessage.includes('prix') || lowerMessage.includes('cout') || lowerMessage.includes('tarif') || lowerMessage.includes('combien')) {
      lastContext = 'pricing';
      return 'Pour les prix, contactez-nous au <b>+216 54 44 20 95</b> ou à <b>contact@ipset.tn</b>. Visitez <a href="inscription.html" target="_blank">notre page d’inscription</a>. Besoin d’un devis ?';
    }

    if (lowerMessage.includes('en ligne') || lowerMessage.includes('online') || lowerMessage.includes('distance')) {
      lastContext = 'online_courses';
      return 'Nos formations sont principalement en présentiel, mais contactez-nous au <b>+216 54 44 20 95</b> ou à <b>contact@ipset.tn</b> pour des options en ligne. Intéressé(e) par une formation spécifique ?';
    }

    if (lowerMessage.includes('horaire') || lowerMessage.includes('planning') || lowerMessage.includes('schedule')) {
      lastContext = 'schedules';
      return 'Nos horaires sont flexibles. Consultez <a href="inscription.html" target="_blank">notre page d’inscription</a> ou appellez le <b>+216 54 44 20 95</b>. Questions sur une formation ?';
    }

    if (lowerMessage.includes('lieu') || lowerMessage.includes('ou') || lowerMessage.includes('localisation')) {
      lastContext = 'locations';
      return 'Centres à <b>IPSET Avenue Paris</b>, <b>IPSET Rue de Niger</b>, et <b>IPSET Barcelone</b>. Siège à <b>4, Rue des Entrepreneurs, Tunis</b>. Plus sur <a href="contact.html" target="_blank">notre page Contact</a>. Quel centre vous intéresse ?';
    }

    lastContext = null;
    const fallbacks = [
      'Merci pour votre message ! Parlez-moi de vos besoins en <a href="formations-initiales.html" target="_blank">formations</a>, <a href="events.html" target="_blank">événements</a> ou <a href="/inscription.html" target="_blank">inscriptions</a>, ou contactez-nous au <b>+216 54 44 20 95</b>.',
      'Je n’ai pas compris votre demande. Essayez de préciser, ou visitez <a href="index.html" target="_blank">notre site</a> pour plus d’infos !',
      'Dites-m’en plus sur ce que vous cherchez ! Découvrez nos <a href="formations-initiales.html" target="_blank">formations</a> ou contactez-nous à <b>contact@ipset.tn</b>.'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
});