const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {

  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      arrowUp();
    } else {
      content.style.display = "block";
      arrowDown();
    }
  });
} 

function arrowUp() {
    const arrow = document.getElementById('arrow')
    arrow.innerHTML = '▲'
}

function arrowDown() {
    const arrow = document.getElementById('arrow')
    arrow.innerHTML = '▼'
}


