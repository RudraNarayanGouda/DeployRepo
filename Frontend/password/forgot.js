// =============================
// Elements
// =============================
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const resetBtn = document.getElementById("resetBtn");

const emailStep = document.getElementById("emailStep");
const otpStep = document.getElementById("otpStep");
const resetStep = document.getElementById("resetStep");

let resetEmail = "";
let resetOtp = "";

// 🔒 Flags (prevent multiple clicks)
let sendingOtp = false;
let verifyingOtp = false;
let resettingPass = false;


// =============================
// 1️⃣ Send OTP
// =============================
sendOtpBtn.addEventListener("click", async () => {

    if (sendingOtp) return; // 🚫 prevent multiple clicks

    const email = document.getElementById("email").value.trim();
    if (!email) {
        alert("Please enter email");
        return;
    }

    sendingOtp = true;
    sendOtpBtn.disabled = true;

    try {
        const res = await fetch(`https://parivahan-ticket.onrender.com/users/send-otp?email=${encodeURIComponent(email)}`, {
            method: "POST"
        });

        const text = await res.text();
        alert(text);

        if (res.ok) {
            resetEmail = email;
            emailStep.classList.add("hidden");
            otpStep.classList.remove("hidden");
        }

    } catch (err) {
        console.error(err);
        alert("Error sending OTP ❌");
    } finally {
        sendingOtp = false;
        sendOtpBtn.disabled = false;
    }
});


// =============================
// 2️⃣ Verify OTP
// =============================
verifyOtpBtn.addEventListener("click", async () => {

    if (verifyingOtp) return; // 🚫 prevent multiple clicks

    const otp = document.getElementById("otp").value.trim();
    if (!otp) {
        alert("Please enter OTP");
        return;
    }

    verifyingOtp = true;
    verifyOtpBtn.disabled = true;

    try {
        const res = await fetch(
            `https://parivahan-ticket.onrender.com/users/verify-otp?email=${encodeURIComponent(resetEmail)}&code=${encodeURIComponent(otp)}`,
            { method: "POST" }
        );

        const text = await res.text();

        if (res.ok) {
            alert("OTP verified ✅");
            resetOtp = otp;

            otpStep.classList.add("hidden");
            resetStep.classList.remove("hidden");
        } else {
            alert(text);
        }

    } catch (err) {
        console.error(err);
        alert("Error verifying OTP ❌");
    } finally {
        verifyingOtp = false;
        verifyOtpBtn.disabled = false;
    }
});


// =============================
// 3️⃣ Reset Password
// =============================
resetBtn.addEventListener("click", async () => {

    if (resettingPass) return; // 🚫 prevent multiple clicks

    const newPass = document.getElementById("newpass").value.trim();
    const confirm = document.getElementById("confirmPass").value.trim();

    if (!newPass || !confirm) {
        alert("Please fill both fields");
        return;
    }

    if (newPass !== confirm) {
        alert("Passwords do not match ❌");
        return;
    }

    resettingPass = true;
    resetBtn.disabled = true;

    try {
        const res = await fetch("https://parivahan-ticket.onrender.com/users/reset-password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: resetEmail,
                otp: resetOtp,
                newPassword: newPass
            })
        });

        const text = await res.text();

        if (res.ok) {
            alert("Password reset successful ✅");

            // 🔄 Reset UI
            emailStep.classList.remove("hidden");
            otpStep.classList.add("hidden");
            resetStep.classList.add("hidden");

            document.getElementById("email").value = "";
            document.getElementById("otp").value = "";
            document.getElementById("newpass").value = "";
            document.getElementById("confirmPass").value = "";

        } else {
            alert(text);
        }

    } catch (err) {
        console.error(err);
        alert("Error resetting password ❌");
    } finally {
        resettingPass = false;
        resetBtn.disabled = false;
    }
});