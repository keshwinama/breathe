document.addEventListener("DOMContentLoaded", () => {


  /* =========================
     CURRENT NAVIGATION
  ========================= */

  const file =
    window.location.pathname.split("/").pop()
    || "index.html";


  const pageMap = {

    "index.html": "home",

    "learn.html": "learn",

    "tools.html": "tools",

    "support.html": "help",

    "about.html": "about"

  };


  const current = pageMap[file];


  document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

      if(link.dataset.page === current){

        link.classList.add(
          `current-${current}`
        );

        link.setAttribute(
          "aria-current",
          "page"
        );

      }

    });



  /* =========================
     MOBILE MENU
  ========================= */

  const menuToggle =
    document.querySelector(".menu-toggle");

  const navLinks =
    document.querySelector(".nav-links");


  if(menuToggle && navLinks){

    menuToggle.addEventListener(
      "click",
      () => {

        const open =
          navLinks.classList.toggle("open");


        menuToggle.setAttribute(
          "aria-expanded",
          String(open)
        );


        menuToggle.setAttribute(
          "aria-label",
          open
            ? "Close menu"
            : "Open menu"
        );

      }
    );


    navLinks
      .querySelectorAll("a")
      .forEach(a => {

        a.addEventListener(
          "click",
          () => {

            navLinks.classList.remove("open");

            menuToggle.setAttribute(
              "aria-expanded",
              "false"
            );

            menuToggle.setAttribute(
              "aria-label",
              "Open menu"
            );

          }
        );

      });

  }



  /* =========================
     LEARN ACCORDIONS
  ========================= */

  document
    .querySelectorAll(".accordion-trigger")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const content =
            button.nextElementSibling;


          const expanded =
            button.getAttribute(
              "aria-expanded"
            ) === "true";


          button.setAttribute(
            "aria-expanded",
            String(!expanded)
          );


          if(content){
            content.hidden = expanded;
          }


          const plus =
            button.querySelector(".plus");


          if(plus){

            plus.textContent =
              expanded
                ? "+"
                : "−";

          }

        }
      );

    });



  /* =========================
     BREATHING ACTIVITY
  ========================= */

  const breathOrb =
    document.getElementById(
      "breathOrb"
    );

  const breathPhase =
    document.getElementById(
      "breathPhase"
    );

  const breathStart =
    document.getElementById(
      "breathStart"
    );

  const breathStop =
    document.getElementById(
      "breathStop"
    );

  const breathStatus =
    document.getElementById(
      "breathStatus"
    );


  if(
    breathOrb &&
    breathStart &&
    breathStop
  ){

    let breathing = false;

    let timer = null;

    let phase = 0;


    const phases = [

      {
        name:"Breathe in",
        scale:1.14,
        duration:4000
      },

      {
        name:"Breathe out",
        scale:.84,
        duration:6000
      }

    ];


    const runPhase = () => {

      if(!breathing){
        return;
      }


      const current =
        phases[phase];


      breathPhase.textContent =
        current.name;


      breathOrb.style.transform =
        `scale(${current.scale})`;


      breathStatus.textContent =
        current.name +
        " · go at a comfortable pace.";


      timer =
        setTimeout(
          () => {

            phase =
              (phase + 1)
              % phases.length;

            runPhase();

          },
          current.duration
        );

    };


    breathStart.addEventListener(
      "click",
      () => {

        if(breathing){
          return;
        }


        breathing = true;

        phase = 0;

        runPhase();

      }
    );


    breathStop.addEventListener(
      "click",
      () => {

        breathing = false;

        clearTimeout(timer);

        breathOrb.style.transform =
          "scale(1)";

        breathPhase.textContent =
          "Ready";

        breathStatus.textContent =
          "Paused. Return to your normal breathing whenever you like.";

      }
    );

  }



  /* =========================
     QUICK GROUNDING DRAW
  ========================= */

  const canvas =
    document.getElementById(
      "groundingCanvas"
    );

  const nextGrounding =
    document.getElementById(
      "nextGrounding"
    );


  if(canvas && nextGrounding){

    const ctx =
      canvas.getContext("2d");


    const color =
      document.getElementById(
        "penColor"
      );


    const undo =
      document.getElementById(
        "undoDraw"
      );


    const clear =
      document.getElementById(
        "clearDraw"
      );


    const stageMeta =
      document.getElementById(
        "stageMeta"
      );


    const stageName =
      document.getElementById(
        "stageName"
      );


    const drawPrompt =
      document.getElementById(
        "drawPrompt"
      );


    const drawHelp =
      document.getElementById(
        "drawHelp"
      );


    const groundingHint =
      document.getElementById(
        "groundingHint"
      );


    const checkinJump =
      document.getElementById(
        "checkinJump"
      );


    const goCheckin =
      document.getElementById(
        "goCheckin"
      );


    const stepButtons =
      [
        ...document.querySelectorAll(
          ".step-pill"
        )
      ];



    /* Four grounding prompts */

    const stages = [

      {

        name:"LOOK",

        prompt:
          "Draw something you see.",

        help:
          "Look around you and quickly sketch something you can see.",

        hint:
          "Notice one small detail, then draw it."

      },


      {

        name:"LISTEN",

        prompt:
          "Draw something you hear.",

        help:
          "Pause and notice a sound around you. Turn that sound into a simple shape, line or picture.",

        hint:
          "You don't have to draw the sound realistically — just represent it."

      },


      {

        name:"FEEL",

        prompt:
          "Draw something you can physically feel.",

        help:
          "Notice one physical sensation, like your feet on the floor or the texture of something nearby.",

        hint:
          "Use a shape, pattern or line that matches the sensation."

      },


      {

        name:"SMELL",

        prompt:
          "Draw something you can smell.",

        help:
          "Notice a scent around you, even if it is very faint, and turn it into a little sketch.",

        hint:
          "A smell can be a memory, a place, an object or simply a colour and shape."

      }

    ];



    let stage = 0;

    let drawing = false;

    let history = [];



    /* Clear canvas */

    const blank = () => {

      ctx.fillStyle =
        "#fffefa";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

    };



    /* Save drawing state */

    const snapshot = () => {

      if(history.length >= 12){
        history.shift();
      }

      history.push(
        canvas.toDataURL(
          "image/png"
        )
      );

    };



    /* Restore drawing */

    const restore = data => {

      const img =
        new Image();


      img.onload = () => {

        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );


        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

      };


      img.src = data;

    };



    /* Convert mouse / pen position */

    const point = event => {

      const rect =
        canvas.getBoundingClientRect();


      return {

        x:
          (event.clientX - rect.left)
          * canvas.width
          / rect.width,

        y:
          (event.clientY - rect.top)
          * canvas.height
          / rect.height

      };

    };



    /* Change prompt */

    const updateStage = () => {

      const item =
        stages[stage];


      stageMeta.textContent =
        `${stage + 1} of ${stages.length}`;


      stageName.textContent =
        item.name;


      drawPrompt.textContent =
        item.prompt;


      drawHelp.textContent =
        item.help;


      groundingHint.textContent =
        item.hint;


      nextGrounding.textContent =
        stage === stages.length - 1
          ? "Finish →"
          : "Next →";


      stepButtons.forEach(
        (button,index) => {

          button.classList.toggle(
            "active",
            index === stage
          );

        }
      );


      checkinJump.classList.toggle(
        "show",
        stage === stages.length - 1
        &&
        checkinJump.dataset.finished === "true"
      );

    };



    /* Reset drawing for each stage */

    const clearStage = () => {

      blank();

      history = [];

      snapshot();

    };



    /* Initial canvas */

    blank();

    snapshot();


    ctx.lineCap =
      "round";


    ctx.lineJoin =
      "round";


    ctx.lineWidth =
      5;



    /* Start drawing */

    canvas.addEventListener(
      "pointerdown",
      event => {

        drawing = true;

        canvas.setPointerCapture(
          event.pointerId
        );


        const p =
          point(event);


        ctx.beginPath();

        ctx.moveTo(
          p.x,
          p.y
        );

      }
    );



    /* Continue drawing */

    canvas.addEventListener(
      "pointermove",
      event => {

        if(!drawing){
          return;
        }


        const p =
          point(event);


        ctx.strokeStyle =
          color
            ? color.value
            : "#294b43";


        ctx.lineTo(
          p.x,
          p.y
        );


        ctx.stroke();

      }
    );



    /* Finish stroke */

    const finishStroke = () => {

      if(!drawing){
        return;
      }


      drawing = false;

      snapshot();

    };


    canvas.addEventListener(
      "pointerup",
      finishStroke
    );


    canvas.addEventListener(
      "pointercancel",
      finishStroke
    );



    /* Undo */

    undo.addEventListener(
      "click",
      () => {

        if(history.length <= 1){
          return;
        }


        history.pop();


        restore(
          history[
            history.length - 1
          ]
        );

      }
    );



    /* Clear */

    clear.addEventListener(
      "click",
      clearStage
    );



    /* Click numbered steps */

    stepButtons.forEach(
      (button,index) => {

        button.addEventListener(
          "click",
          () => {

            stage = index;

            clearStage();

            checkinJump.dataset.finished =
              "false";

            checkinJump.classList.remove(
              "show"
            );

            updateStage();

          }
        );

      }
    );



    /* Next button */

    nextGrounding.addEventListener(
      "click",
      () => {

        if(
          stage <
          stages.length - 1
        ){

          stage += 1;

          clearStage();

          updateStage();

        }

        else{

          checkinJump.dataset.finished =
            "true";

          checkinJump.classList.add(
            "show"
          );


          checkinJump.scrollIntoView({
            behavior:"smooth",
            block:"center"
          });

        }

      }
    );



    /* Go to check-in */

    if(goCheckin){

      goCheckin.addEventListener(
        "click",
        () => {

          const checkin =
            document.getElementById(
              "checkin"
            );


          if(checkin){

            checkin.scrollIntoView({
              behavior:"smooth",
              block:"start"
            });

          }

        }
      );

    }



    updateStage();

  }



  /* =========================
     MOOD CHECK-IN
  ========================= */

  const moods =
    document.querySelectorAll(
      ".mood"
    );


  const moodStatus =
    document.getElementById(
      "moodStatus"
    );


  if(moods.length){

    const chosen =
      new Set();


    moods.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const mood =
              button.dataset.mood;


            if(chosen.has(mood)){

              chosen.delete(mood);

              button.classList.remove(
                "selected"
              );

            }

            else{

              chosen.add(mood);

              button.classList.add(
                "selected"
              );

            }


            moodStatus.textContent =
              chosen.size

                ? `You chose: ${[
                    ...chosen
                  ].join(", ")}.`

                : "";

          }
        );

      }
    );

  }



  /* =========================
     JOURNAL
  ========================= */

  const journal =
    document.getElementById(
      "journal"
    );


  const saveJournal =
    document.getElementById(
      "saveJournal"
    );


  const clearJournal =
    document.getElementById(
      "clearJournal"
    );


  const journalStatus =
    document.getElementById(
      "journalStatus"
    );


  if(
    journal &&
    saveJournal &&
    clearJournal
  ){

    try{

      journal.value =
        localStorage.getItem(
          "breathe-journal"
        )
        || "";

    }

    catch(e){}



    saveJournal.addEventListener(
      "click",
      () => {

        try{

          localStorage.setItem(
            "breathe-journal",
            journal.value
          );


          journalStatus.textContent =
            "Saved on this device.";

        }

        catch(e){

          journalStatus.textContent =
            "This browser did not allow local saving.";

        }

      }
    );



    clearJournal.addEventListener(
      "click",
      () => {

        journal.value = "";


        try{

          localStorage.removeItem(
            "breathe-journal"
          );

        }

        catch(e){}


        journalStatus.textContent =
          "Cleared.";

      }
    );

  }



  /* =========================
     SUPPORT CONVERSATION
  ========================= */

  const scriptOutput =
    document.getElementById(
      "scriptOutput"
    );


  document
    .querySelectorAll(".script-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          if(scriptOutput){

            scriptOutput.textContent =
              button.dataset.script
              || "";

          }

        }
      );

    });



  /* =========================
     FOOTER YEAR
  ========================= */

  document
    .querySelectorAll(".year")
    .forEach(el => {

      el.textContent =
        new Date().getFullYear();

    });


});