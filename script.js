
function toggleCustom(id) {
  const select = document.getElementById(id);
  const customInput = document.getElementById(id + 'Custom');
  if (select.value === 'Custom...') {
    customInput.style.display = 'block';
    customInput.focus();
  } else {
    customInput.style.display = 'none';
    customInput.value = '';
  }
}

function autoFillKeyword() {
  const ideas = ['Jakarta Skyline', 'Balinese Temple', 'Bandung Cafés', 'Padang Culture'];
  const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
  document.getElementById('keyword').value = randomIdea;
}

function getValue(id) {
  const select = document.getElementById(id);
  const custom = document.getElementById(id + 'Custom');
  return select.value === 'Custom...' ? custom.value : select.value;
}

function copyPrompt() {
  const outputTextarea = document.getElementById('output');
  outputTextarea.select();
  document.execCommand('copy');
  const feedbackElem = document.getElementById('copyFeedback');
  feedbackElem.textContent = 'Tersalin!';
  feedbackElem.classList.add('show');
  setTimeout(() => {
    feedbackElem.classList.remove('show');
  }, 1500);
}

function generatePrompt() {
  const keyword = document.getElementById('keyword').value;
  const imageOnly = document.getElementById('imageOnly').checked;
  const customMode = document.getElementById('customMode').checked;
  const addKeywordTitle = document.getElementById('addKeywordTitle').checked;
  const angle = getValue('angle');
  const style = getValue('style');
  const palette = getValue('palette');
  const background = getValue('background');
  const embedText = document.getElementById('embedText').value;

  let finalPrompt = "";

  if (imageOnly) {
    finalPrompt = "Transform this photo into a high-quality 3D isometric illustration with a clean and soft shadow. Use an isometric perspective and a friendly, approachable style. Remove the background entirely (transparent).";
  } else if (customMode) {
    let base = `Transform this photo into a ${style || "3D isometric"} render`;
    let extras = [];
    if (angle) extras.push(`${angle} perspective`);
    if (palette) extras.push(`${palette} color palette`);
    if (background) extras.push(`${background} background`);
    finalPrompt = `${base}, ${extras.join(', ')}.`;
    if (embedText) finalPrompt += ` Include text: '${embedText}'.`;
  } else {
    finalPrompt = `Generate an icon themed around '${keyword}'`;
    if (style) finalPrompt += ` in ${style} style`;
    if (angle) finalPrompt += ` with ${angle} perspective`;
    if (palette) finalPrompt += `. Use ${palette} color palette.`;
    if (background) finalPrompt += ` Background: ${background}.`;
    if (embedText) finalPrompt += ` Embed text: '${embedText}'.`;
  }

  if (addKeywordTitle) {
    finalPrompt += ` Add a title above the image: '${keyword}'.`;
  }

  document.getElementById('output').value = finalPrompt;

  document.getElementById('imageResultSection').style.display = 'block';
  document.getElementById('loadingSpinner').style.display = 'block';
  setTimeout(() => {
    document.getElementById('loadingSpinner').style.display = 'none';
  }, 2000);
}
