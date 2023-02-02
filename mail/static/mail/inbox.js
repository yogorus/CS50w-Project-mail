document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Make request
  document.querySelector('#compose-form').onsubmit = () => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: `${document.querySelector('#compose-recipients').value}`,
        subject: `${document.querySelector('#compose-subject').value}`,
        body: `${document.querySelector('#compose-body').value}`
      })
    })
    .then(response => response.json())
    .then(result => {
      load_mailbox('sent')
      console.log(result);
    });

    // Prevent form from reloading the page
    return false;
  }
}

function load_email() {

  // Show email and hide other views
  document.querySelector('#email-content').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';

  let id = this.dataset.id;
  fetch(`emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Log content of email
    console.log(email);
    
    // Render email
    document.querySelector('#email-sender').innerHTML = `${email.sender}`;
    document.querySelector('#email-recipients').innerHTML = `${email.recipients}`;
    document.querySelector('#email-subject').innerHTML = `${email.subject}`;
    document.querySelector('#email-timestamp').innerHTML = `${email.timestamp}`;
    document.querySelector('#email-body').innerHTML = `${email.body}`;

    // Add Archive

    // Add reply
  });
  // Mark as read
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Make request to server
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    emails.forEach(contents => {
      // Create div for each email
      const email = document.createElement('div');
      
      // Change background color depending on if email is read or not
      let bgColor = '';
      if (contents.read === false) {
        bgColor = 'bg-white';
      } else {
        bgColor = 'bg-light';
      }
      
      const result = `
      <div class="justify-content-start">
        <span class='font-weight-bold p-1'>${contents.sender}</span>
        <span class='p-1 text-secondary'>${contents.subject}</span>
        <span class="float-right text-muted">${contents.timestamp}</span>
      </div>
     `;
      email.className = `card mb-2 p-2 ${bgColor}`;
      email.innerHTML = result.trim();
      email.dataset.id = contents.id;
      email.addEventListener('click', load_email);

      // Add email to DOM
      document.querySelector('#emails-view').append(email);
    });
  });
}