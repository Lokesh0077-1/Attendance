function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const btn = document.getElementById("themeToggle");
  btn.innerText = document.body.classList.contains("dark-mode") ? "🌙 Dark" : "🌞 Light";
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  const page = document.getElementById(pageId);
  page.style.display = "block";

  // If showing roll input page, clear input
  if (pageId === "rollPage") {
    document.getElementById("rollNumber").value = "";
    document.getElementById("rollNumber").focus();
  }

  // Clear attendance info if going back
  if (pageId === "attendancePage" === false) {
    const info = document.getElementById("attendanceInfo");
    if (info) info.innerHTML = "";
  }
}

function showDateTime() {
  const dt = document.getElementById("datetime");
  if (dt) dt.innerText = new Date().toLocaleString();
  setTimeout(showDateTime, 1000);
}

function submitRollNumber() {
  const roll = document.getElementById("rollNumber").value.trim();
  if (!/^\d{8}$/.test(roll)) {
    alert("Enter a valid 8-digit roll number.");
    return;
  }
  localStorage.setItem("rollNumber", roll);
  displayAttendance();
  showPage("attendancePage");
}

function displayAttendance() {
  const roll = localStorage.getItem("rollNumber");
  const info = document.getElementById("attendanceInfo");

  if (!roll || !attendanceData[roll]) {
    info.innerHTML = `<p style="color:red; text-align:center;">No data found for roll number ${roll}</p>`;
    return;
  }

  const att = attendanceData[roll];
  let table = `<table class="attendance-table">
    <tr><th>Subject</th><th>Attended</th><th>Total</th><th>%</th></tr>`;

  let totalAttended = 0, totalClasses = 0;
  for (let subject in att) {
    const { attended, total } = att[subject];
    totalAttended += attended;
    totalClasses += total;
    const perc = ((attended / total) * 100).toFixed(2);
    let cls = perc < 50 ? "low" : perc < 75 ? "medium" : "high";
    table += `<tr class="${cls}"><td>${subject}</td><td>${attended}</td><td>${total}</td><td>${perc}%</td></tr>`;
  }

  const overallPerc = ((totalAttended / totalClasses) * 100).toFixed(2);
  table += `</table>
    <div class="attendance-card">Overall Attendance: ${totalAttended}/${totalClasses} (${overallPerc}%)</div>`;

  info.innerHTML = table;
}
