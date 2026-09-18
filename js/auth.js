async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = error.message;
    message.style.color = 'red';
  } else {
    window.location.href = 'index.html';
  }
}

async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    message.textContent = error.message;
    message.style.color = 'red';
  } else {
    message.textContent = 'Conta criada! Verifique seu e-mail.';
    message.style.color = 'green';
  }
}

// Protege as páginas
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session && !window.location.href.includes('login.html')) {
    window.location.href = 'login.html';
  }
}
