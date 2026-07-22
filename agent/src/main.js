const { invoke } = window.__TAURI__.core;

let supabaseClient = null;

async function init() {
  try {
    // 1. Get Supabase Config from Rust Backend (which reads .env)
    const config = await invoke("get_supabase_config");
    supabaseClient = window.supabase.createClient(config.url, config.key);

    // 2. Check if we already logged in previously
    const savedEmployeeId = await invoke("get_saved_employee_id");
    if (savedEmployeeId) {
      showSuccessScreen();
      await invoke("start_monitoring_with_credentials", { employeeId: savedEmployeeId });
    }
  } catch (err) {
    console.error("Failed to initialize:", err);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  const loginBtn = document.getElementById("login-btn");

  errorMsg.classList.add("hidden");
  loginBtn.disabled = true;
  loginBtn.textContent = "Connecting...";

  try {
    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Get Employee ID using the user's email
    const userEmail = authData.user.email;
    const { data: empData, error: empError } = await supabaseClient
      .from('employees')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (empError) {
      console.warn("Could not find employee record by email. Using auth UUID directly.", empError);
    }
    
    const employeeId = empData?.id || authData.user.id;

    // 3. Start monitoring via Rust Backend
    await invoke("start_monitoring_with_credentials", { employeeId });

    // 4. Show success
    showSuccessScreen();
  } catch (err) {
    errorMsg.textContent = err.message || "Invalid credentials.";
    errorMsg.classList.remove("hidden");
    loginBtn.disabled = false;
    loginBtn.textContent = "Log In & Connect";
  }
}

function showSuccessScreen() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("success-screen").classList.remove("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
  init();
  
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  
  document.getElementById("hide-btn").addEventListener("click", () => {
    invoke("hide_window");
  });
});
