document.addEventListener('DOMContentLoaded', function() {
  const leftDiv = document.querySelector(".left-shift-button");
  const rightDiv = document.querySelector(".right-shift-button");
  const boxes = document.querySelectorAll(".box");

  leftDiv.onclick = () => {
    const values = Array.from(boxes).map(b => b.textContent.trim());
    values.push(values.shift()); // left shift
    boxes.forEach((b, i) => b.textContent = values[i]);
  };

  rightDiv.onclick = () => {
    const values = Array.from(boxes).map(b => b.textContent.trim());
    values.unshift(values.pop()); // right shift
    boxes.forEach((b, i) => b.textContent = values[i]);
  };
});
