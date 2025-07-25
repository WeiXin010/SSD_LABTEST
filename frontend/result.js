document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  
  const escapeHTML = (str) =>
    str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  document.getElementById('result').innerHTML = escapeHTML(q);

  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '/';
  });
});
