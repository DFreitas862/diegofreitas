async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

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

  const { data, error } = await supabaseClient.auth.signUp({ email, password });

  if (error) {
    message.textContent = error.message;
    message.style.color = 'red';
  } else {
    message.textContent = 'Conta criada! Verifique seu e-mail ou faça login.';
    message.style.color = 'green';
  }
}

async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = 'login.html';
}
