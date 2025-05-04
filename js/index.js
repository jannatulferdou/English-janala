// spiner

const makeHide=(id)=>{
    document.getElementById(id).style.display="none";
}
const show=(id)=>{
    document.getElementById(id).style.display="block";
}


// vocab
document.getElementById('learn-btn').addEventListener('click', function() {
    const vocabularySection = document.getElementById('vocab-section');
    vocabularySection.style.display = 'block'; 
    vocabularySection.scrollIntoView({ behavior: 'smooth' }); 
});

// faq
document.getElementById('faq-btn').addEventListener('click', function() {
    const faqSection = document.getElementById('faq-section');
    faqSection.style.display = 'block'; 
    faqSection.scrollIntoView({ behavior: 'smooth' }); 
});

// Login 
document.getElementById('login-btn').addEventListener('click', function () {
    const name = document.getElementById('name').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!name) {
        alert("Please enter your name first.");
        return;
    }

    if (password !== "123456") {
        alert("Wrong password. Contact admin to get your login code.");
        return;
    }

    // Success
    Swal.fire({
        title: "অভিনন্দন 🎉",
        text: "চলুন আজ নতুন কিছু শেখা যাক।",
        icon: "success",
        draggable: true
    }).then(() => {
        
        document.getElementById('login-banner').style.display = 'none';
        document.getElementById('navbar').style.display = 'flex';
        document.getElementById('vocab-section').style.display = 'block'; 
        document.getElementById('faq-section').style.display = 'block';
        document.getElementById('vocab-section').scrollIntoView({ behavior: 'smooth' });
    });
});
// Logout 
document.querySelector('.logout-btn').addEventListener('click', function () {
    
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('vocab-section').style.display = 'none';
    document.getElementById('faq-section').style.display = 'none';

    document.getElementById('login-banner').style.display = 'flex';

    document.getElementById('name').value = '';
    document.getElementById('password').value = '';

    
    alert("You have been logged out.");
});
// lesson
const loadLevel = async () => {
    
        const response = await fetch("https://openapi.programming-hero.com/api/levels/all");
        const data = await response.json();
        showLevel(data.data);
    
};

const showLevel = (data) => {
    const vocabulariesContainer = document.getElementById("vocabularies-container");
    vocabulariesContainer.innerHTML = "";

    data.forEach(element => {
        const div = document.createElement("div");
        div.innerHTML = `
            <button onclick="handleLessonClick(this, '${element.level_no}')" class="btn btn-outline btn-primary">
                <img src="https://img.icons8.com/?size=100&id=38390&format=png&color=7950F2" alt="" class="w-5">
                Lesson-${element.level_no}
            </button>
        `;
        vocabulariesContainer.appendChild(div);
    });
};

// active btn
function removeActiveClass() {
    document.querySelectorAll(".active").forEach(btn => btn.classList.remove("active"));
}

const handleLessonClick = (clickedButton, levelNo) => {
    loadWord(levelNo);
    removeActiveClass();
    clickedButton.classList.add("active");
}


// word
const loadWord = async (levelNo) => {
    show("spiner");
    try {
     

        document.getElementById("select-container").style.display = "none";
        document.getElementById("word-container").style.display = "block";
        document.getElementById("next-container").style.display = "none"; // Reset next-container display

        const response = await fetch(`https://openapi.programming-hero.com/api/level/${levelNo}`);
        const data = await response.json();


        if (data.data) {
            displayWord(data.data);

        
            // Show next-container only for Lesson-4 and Lesson-7
            if (levelNo == 4 || levelNo == 7) {
                document.getElementById("next-container").style.display = "block";
                document.getElementById("select-container").style.display = "none";
            }
        } else {
            console.error("No data found for this level.");
        }
    } catch (error) {
        console.error("Error loading words:", error);
       
    }
    makeHide("spiner");
   
};

const displayWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    if (words.length<1) {
        document.getElementById("word-container").style.display = "none";
        document.getElementById("select-container").style.display = "block";
        document.getElementById("next-container").style.display = "none";
        return;
    }

    
    words.forEach((word) => {
        const div = document.createElement("div");
        div.classList.add("mt-5");
        div.innerHTML = `
            <div class="card bg-base-100 shadow-sm mx-auto w-full h-full">
                <div class="card-body">
                    <div class="p-10">
                        <h2 class="card-title text-center justify-center text-2xl font-bold mb-4">
                            ${word.word}
                        </h2>
                        <p class="text-center justify-center text-sm mb-3">Meaning /Pronounciation</p>
                         
                        <h3 class="text-center justify-center hind-siliguri-font text-2xl text-gray-600 font-bold">"${word.meaning || "অর্থ নেই"}/${word.pronunciation}"</h3>
                    </div> 
                    <div class="card-actions justify-between">
                        <div class=""> 
                            <button class="btn" onclick="my_modal_1.showModal();loadWordDetails(${word.id})"><img src="https://img.icons8.com/?size=100&id=84013&format=png&color=000000" alt="" class="w-5 h-5"></button>
                            
                        </div>
                        <div class=""> 
                            <button onclick="pronounceWord('${word.word}')" class="btn"><img src="https://img.icons8.com/?size=100&id=41563&format=png&color=000000" alt="" class="w-5"></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        wordContainer.appendChild(div);
    });
   
};


function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN'; // Japanese
    window.speechSynthesis.speak(utterance);
  }
// modal


const loadWordDetails = async (id) => {
    console.log("Loading word details:", id);
    const modalBody = document.getElementById('modal_body');
    modalBody.innerHTML = "";

    
        const response = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);
        const resData = await response.json();
       
        const wordData = resData.data; 

        modalBody.innerHTML = `
            <div class="card shadow-sm p-5">
  <div class="modal-content">
      <h2 class="text-2xl font-bold flex">${wordData.word}(<img src="https://img.icons8.com/?size=100&id=12653&format=png&color=000000" alt="" class="w-5 h-6 mt-1"> : ${wordData.pronunciation} )</h2>
      <div class="mt-5">
          <p class="text-lg font-bold">Meaning</p>

          <h3 class=" hind-siliguri-font text-sm text-gray-600 mt-2">${wordData.meaning || "অর্থ পাওয়া যায়নি"}</h3>

          
      
      <div class="mt-5">
          <h2 class="text-lg font-bold mb-2">Example</h2>
          <p class="text-sm text-gray-600">${wordData.sentence}</p>
      </div>
      <div class="mt-5">
          <h2 class="font-bold text-xl">সমার্থক শব্দ গুলো</h2>
          ${wordData.synonyms?.length 
              ? wordData.synonyms.map(syn => `<button class="btn btn-sm m-1">${syn}</button>`).join("")
              : ""
          }
      </div>
  </div>
</div>

        `;
    
};



loadLevel();