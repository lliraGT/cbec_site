const EmailInvite = ({ email }) => {
  const sendInvite = async () => {
    const uniqueLink = `${window.location.origin}/test?userId=${generateUniqueId()}`;

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: email,
          subject: 'Personality Test Invitation',
          text: `Please complete the personality test by clicking the following link: ${uniqueLink}`,
          html: `<p>Please complete the personality test by clicking the following link:</p><a href="${uniqueLink}">${uniqueLink}</a>`
        })
      });

      if (response.ok) {
        console.log('Email sent successfully!');
      } else {
        console.error('Error sending email:', await response.json());
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const generateUniqueId = () => {
    return `user-${Math.random().toString(36).substring(2, 10)}`;
  };

  return (
    <button onClick={sendInvite}>
      Send Invite
    </button>
  );
};

export default EmailInvite;