/**
 * Toggles the visibility of a custom input field based on the selected option.
 * Mengubah visibilitas kolom input kustom berdasarkan opsi yang dipilih.
 * @param {string} id - The ID of the select element. ID elemen select.
 */
function toggleCustom(id) {
  const select = document.getElementById(id);
  const customInput = document.getElementById(id + 'Custom');
  if (select.value === 'Custom...') {
    customInput.style.display = 'block';
    customInput.focus(); // Focus on the custom input for immediate typing
  } else {
    customInput.style.display = 'none';
    customInput.value = ''; // Clear custom input when not in use
  }
}

/**
 * Fills the keyword input with a random idea from a predefined list.
 * Mengisi kolom input kata kunci dengan ide acak dari daftar yang telah ditentukan.
 */
function autoFillKeyword() {
  // These are English examples, implying translation would happen on backend.
  const ideas = ['Jakarta Skyline', 'Balinese Temple', 'Bandung Cafés', 'Padang Culture', 'Tropical Island', 'Ancient Ruins', 'Futuristic Cityscape', 'Mystical Forest'];
  const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
  document.getElementById('keyword').value = randomIdea;
}

/**
 * Retrieves the value from either a select element or its associated custom input.
 * Mengambil nilai dari elemen select atau input kustom terkait.
 * @param {string} id - The ID of the select element. ID elemen select.
 * @returns {string} The selected or custom value. Nilai yang dipilih atau kustom.
 */
function getValue(id) {
  const select = document.getElementById(id);
  const custom = document.getElementById(id + 'Custom');
  return select.value === 'Custom...' ? custom.value : select.value;
}

/**
 * Copies the generated prompt text to the clipboard and shows feedback.
 * Menyalin teks prompt yang dihasilkan ke clipboard dan menampilkan umpan balik.
 */
function copyPrompt() {
  const outputTextarea = document.getElementById('output');
  outputTextarea.select(); // Select the text in the textarea
  outputTextarea.setSelectionRange(0, 99999); // For mobile devices

  // Use document.execCommand('copy') for better compatibility in iframes
  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'Tersalin!' : 'Gagal menyalin!';
    const feedbackElem = document.getElementById('copyFeedback');
    feedbackElem.textContent = msg;
    feedbackElem.classList.add('show');
    setTimeout(() => {
      feedbackElem.classList.remove('show');
    }, 1500); // Hide feedback after 1.5 seconds
  } catch (err) {
    console.error('Failed to copy text: ', err);
    const feedbackElem = document.getElementById('copyFeedback');
    feedbackElem.textContent = 'Gagal menyalin!';
    feedbackElem.classList.add('show');
    setTimeout(() => {
      feedbackElem.classList.remove('show');
    }, 1500);
  }
}

/**
 * Generates the AI prompt based on user selections and updates the textarea.
 * Membuat prompt AI berdasarkan pilihan pengguna dan memperbarui textarea.
 * Mensimulasikan tampilan pembuatan gambar (panggilan API sebenarnya membutuhkan backend).
 */
async function generatePrompt() {
  const keyword = document.getElementById('keyword').value;
  const imageOnly = document.getElementById('imageOnly').checked;
  const customMode = document.getElementById('customMode').checked;
  const addKeywordTitle = document.getElementById('addKeywordTitle').checked;
  const angle = getValue('angle');
  const style = getValue('style');
  const palette = getValue('palette');
  const background = getValue('background');
  const embedText = document.getElementById('embedText').value;
  const selectedAiModel = document.getElementById('aiModel').value;

  let finalPrompt = "";
  let promptParts = []; // Use an array to build parts and join them later for cleaner logic

  if (imageOnly) {
    // High priority: If imageOnly is checked, use its specific prompt
    finalPrompt = "Transform this photo into a high-quality 3D isometric illustration with a clean and soft shadow. Use an isometric perspective and a friendly, approachable style. Render the subject with a smooth, polished 3D appearance. Remove the background entirely (transparent). Make sure the final result has a clean, modern icon aesthetic.";
  } else if (customMode) {
    // If Custom is checked (and imageOnly is not), generate structured text prompt
    const dynamicStyle = (style && style !== 'None') ? style : "3D isometric";
    promptParts.push(`Transform this photo into a ${dynamicStyle}, high-quality 3D render, clean shadow.`);

    if (angle && angle !== 'None') {
      promptParts.push(`${angle} perspective.`);
    }
    if (palette && palette !== 'None') {
      promptParts.push(`${palette} color palette.`);
    }
    if (background && background !== 'None') {
      promptParts.push(`${background} background canvas.`);
    }
    if (embedText) {
      promptParts.push(`Include embedded text: '${embedText}'.`);
    }
    finalPrompt = promptParts.join(' ');

  } else {
    // Default behavior if neither imageOnly nor Custom is checked
    const number = getValue('iconNumber');
    if (number && number !== 'None') {
      promptParts.push(`Generate a single image containing a collection of ${number} icons themed around '${keyword}'. The icons should be arranged in a grid layout.`);
    } else {
      promptParts.push(`Generate an icon themed around '${keyword}'.`);
    }

    let styleAndAnglePart = '';
    if (style && style !== 'None') {
      styleAndAnglePart += `in a ${style} style`;
    }
    if (angle && angle !== 'None') {
      if (styleAndAnglePart) {
        styleAndAnglePart += ` with a ${angle} perspective`;
      } else {
        styleAndAnglePart += `with a ${angle} perspective`;
      }
    }
    if (styleAndAnglePart) {
      promptParts.push(`Each icon must be designed ${styleAndAnglePart}.`);
    }

    if (palette && palette !== 'None') {
      promptParts.push(`Use a color palette in ${palette} style.`);
    }

    if (background && background !== 'None') {
      promptParts.push(`Set the background canvas to ${background}.`);
    }

    if (embedText) {
      promptParts.push(`Include embedded text: '${embedText}'.`);
    }
    finalPrompt = promptParts.join(' ');
  }

  // Add "Add title based on keyword" instruction if checkbox is checked
  if (addKeywordTitle && keyword) { // Only add if keyword exists
    // Ensure the prompt ends with a period before adding more
    if (finalPrompt && !/[.!?]$/.test(finalPrompt.trim())) {
        finalPrompt += ".";
    }
    finalPrompt += ` Include a title above the image based on the keyword: '${keyword}'.`;
  }


  // Add AI Model instruction
  if (selectedAiModel) {
    let modelInstruction = "";
    if (selectedAiModel === "imagen") {
      modelInstruction = "Optimize for Google Imagen.";
    } else if (selectedAiModel === "dalle") {
      modelInstruction = "Optimize for OpenAI DALL-E.";
    }
    if (modelInstruction) {
      // Ensure the prompt ends with a period before adding more
      if (finalPrompt && !/[.!?]$/.test(finalPrompt.trim())) {
        finalPrompt += ".";
      }
      finalPrompt += ` ${modelInstruction}`;
    }
  }

  // Clean up extra spaces and periods
  finalPrompt = finalPrompt.replace(/\s+/g, ' ').trim(); // Remove multiple spaces and trim
  finalPrompt = finalPrompt.replace(/\.\s*\./g, '.'); // Replace " . " with "."
  finalPrompt = finalPrompt.replace(/,\s*\./g, '.'); // Replace ", ." with "." (e.g., "detail, . Optimize")
  finalPrompt = finalPrompt.replace(/\s*,/g, ','); // Remove space before comma

  document.getElementById('output').value = finalPrompt;

  // --- Frontend display logic for the (hypothetical) generated image ---
  const imageResultSection = document.getElementById('imageResultSection');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const imageErrorElem = document.getElementById('imageError');

  imageResultSection.style.display = 'block';
  imageErrorElem.style.display = 'none';
  imageErrorElem.textContent = '';
  loadingSpinner.style.display = 'block'; // Tampilkan spinner loading

  setTimeout(async () => {
    loadingSpinner.style.display = 'none'; // Sembunyikan spinner setelah "simulasi"
  }, 2000); // Simulasikan penundaan 2 detik untuk proses generasi
}