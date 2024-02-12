const longUrlInput = document.getElementById('longUrl');
const shortenButton = document.getElementById('shortenButton');
const shortUrlContainer = document.getElementById('shortUrlContainer');

shortenButton.addEventListener('click', async () => {
  const longUrl = longUrlInput.value.trim();

  if (!longUrl) {
    alert('Please enter a URL');
    return;
  }

  const url = `http://localhost:3000/api/shorten?longUrl=${longUrl}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error shortening URL');
    }

    const data = await response.json();
    const shortUrl = data.shortUrl;

    const shortUrlDiv = document.createElement('div');
    shortUrlDiv.classList.add('p-4', 'bg-blue-100', 'text-blue-800', 'rounded-md', 'inline-block');
    shortUrlDiv.innerHTML = `Short URL: <a href="${shortUrl}" class="underline">${shortUrl}</a>`;
    shortUrlDiv.addEventListener('click', () => {
      copyToClipboard(shortUrl);
      alert('Short URL copied to clipboard');
    });
    
    shortUrlContainer.innerHTML = ''; // Clear previous content
    shortUrlContainer.appendChild(shortUrlDiv);
  } catch (error) {
    alert('Error shortening URL:', error.message);
  }
});

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
