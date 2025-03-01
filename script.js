document.getElementById("metrics-form").addEventListener("submit", (e) => { 
    e.preventDefault(); 
    const sla = document.querySelector("[name=\"sla\"]").value; 
    const cost = document.querySelector("[name=\"cost\"]").value; 
    const procurement = document.querySelector("[name=\"procurement\"]").value; 
    const benchmarks = { sla: 4, cost: 2000, procurement: 7 }; 
    let result = `Your Helpdesk SLA: ${sla} hrs (Industry Avg: ${benchmarks.sla} hrs)<br>`; 
    result += `Your IT Cost/Employee: $${cost} (Industry Avg: $${benchmarks.cost})<br>`; 
    result += `Your Procurement Time: ${procurement} days (Industry Avg: ${benchmarks.procurement} days)<br>`; 
    result += `<a href="/services.html">Book a call to improve your metrics!</a>`; 
    document.getElementById("results").innerHTML = result; 
}); 
