import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";

// 1. ARRAY DE USUARIOS DE PRUEBA (Actualizamos las contraseñas a 6 caracteres)
const usuariosTest: any[] = [
  { email: "admin@admin.com", password: "password123", role: "admin" },
  { email: "cliente@cliente.com", password: "password123", role: "client" }
];

if (!localStorage.getItem("users_db")) {
  localStorage.setItem("users_db", JSON.stringify(usuariosTest));
}

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  
  const valueEmail = inputEmail.value.trim();
  const valuePassword = inputPassword.value.trim();

  // Validación 1: Campos no vacíos
  if (!valueEmail || !valuePassword) {
    alert("Por favor, ingresa email y contraseña.");
    return;
  }

  // Validación 2: Longitud mínima de contraseña (¡El nuevo cambio!)
  if (valuePassword.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  const usersStorage = localStorage.getItem("users_db");
  const usersDB: any[] = usersStorage ? JSON.parse(usersStorage) : [];

  const userEncontrado = usersDB.find(
    (u) => u.email === valueEmail && u.password === valuePassword
  );

  if (userEncontrado) {
    const userActivo: IUser = {
      email: userEncontrado.email,
      role: userEncontrado.role as Rol,
      loggedIn: true,
    };

    localStorage.setItem("userData", JSON.stringify(userActivo));

    // Dentro de src/pages/auth/login/login.ts
if (userActivo.role === "admin") {
    window.location.replace("/src/pages/admin/home/home.html");
} else {
    window.location.replace("/src/pages/client/home/home.html");
}
  } else {
    alert("Credenciales incorrectas. Intente nuevamente.");
  }
});