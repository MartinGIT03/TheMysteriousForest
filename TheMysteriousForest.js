<!DOCTYPE html>
<html>
    <head>
        <title>The Mysterious Forest</title>
        <link rel="stylesheet" href="mainstyles.css">
    </head>
    <body>
      <h1></h1>
    </body>
</html>




<script src="https://koda.nu/simple.js">

/*
   Ditt namn: Martin Karlsson
   Spelets namn: The Mysterious Forest
   Kort beskrivning av vad spelet är tänkt att gå ut på:

   Spelet går ut på att memorisera vilka föremål du behöver (som det står på korten) för att gå vidare i spelet.
   Föremål får du genom att kasta 4 tärningar som sparas i din ryggsäck.
   Om du går fram med Jonas ett steg och du inte har till räckligt med resurser så kommer Jonas
   att dö och man får starta om.

   SNABBSTART:
   Tryck på starta, tryck på ett kort knappen tills alla kort är vända, efter det tryck på reset, tryck nu på slå träningen knappen och vänsterklicka på föremålen som
   kommer upp på skärmen eller håll ner spacebar som göra samma sak, gör detta tills ryggsäcken är full, nu kan du trycka på vänd ett kort för att röra på Jonas.
*/

/*
  Buggar (som jag vet om):
  När swordlighterswordForest.png väljs av funktionen RandomForestCard()
  så slutar den välja nya kort. Jag kommer inte på någon rikigt bra anledningen
  än att det finns flera mönster. swordlighterswordForest.png är sist rent position mässigt i vektorn imageForForest
  kan det här vara anledningen? vet ej. Se foldern bugs i kodmappen för bilder.
*/

///////////////////////////////////////////////////////////////

// Nedanför förekommer vektorer som jag använder för att spara data i.

var valueOfWrongCard = [];
var itemsStoredInBackpack = [];
var itemsStoredRAM = [];
var imagesForCardBack = [];
var imageForDice = ["cape", "crystal", "claw", "compass", "glove", "lighter", "glass", "map", "rope", "sword", "flower"];
var imageForCardFront = ["StartingCardFront.png", "ForestCardFront.png", "WandererCardFront.png", "FinalBattleCardFront.png"," linusfaceCardFront.jpg"];
var imageForForest = ["roperopeForest.png","capeswordcapeForest.png","clawcrystalForest.png","clawgloveForest.png", "compassglassflowerForest.png", "crystalcrystalForest.png","flowercapeglassForest.png", "flowerglassflowerForest.png", "gloveropegloveForest.png", "lighterglassForest.png", "mapcompassForest.png", "mapcompassmapForest.png", "swordlighterswordForest.png"];
var imageForWanderer = ["baglokiWanderer.png", "2bags2tokenWanderer.png", "3bags2tokensWanderer.png", "3bagsWanderer.png", "4bags2tokensWanderer.png"];
var imageForBoss = ["clawcrystalmapcapeBoss.png", "glassswordcapeclawBoss.png", "gloveropeclawBoss.png", "lighterswordropecrystalBoss.png", "lighterflowercompassBoss.png", "lighterglovemapcompassBoss.png"];
var textList = ["Start", "Settings", "Exit", "Easy", "Medium", "Hard", "Gå tillbaka!", "Starta om", "exit"];

///////////////////////////////////////////////////////////////

// Nedanför förekommer variabler som bestämmer olika föremåls positoner på skärmen.

var startButton = {x:totalWidth/2-125, y:totalHeight/2-120};
var button = {x: totalWidth-250, y: totalHeight-150};

var backPackholder = {x: 10, y: totalHeight-240, w: 40, h: 40, dx: 60, dy: 90};
var initialValuesforbackPackholder = {x: 10, y: totalHeight-240, w: 40, h: 40, dx: 60, dy: 90};

var dice = {x: totalWidth/2+90, y:totalHeight-250, w:100, h:100, d: 130};
var initialValuesfordice = {x:totalWidth/2+90, y:totalHeight-250, w:100, h:100, d: 130};

var card = {x:totalWidth/2-600, y:totalHeight/2-160, w: 120, h:120};
var initialValuesforcardFront = {x:totalWidth/2-600, y:totalHeight/2-160, h: 120, w: 120};

var Jonas = {x:totalWidth/2-550, y:totalHeight/2-100, h: 20, w: 20};

/*
  Anledningen varför jag skapar 2 variabler med samma värden är p.g.a att den övre variabeln (t.ex card) förändras i koden.
  Om jag vill t.ex. rita ut flera knappar innuti en while-loop och jag använder mig av variablar för att bestämma dess positon så måste jag nollställa värderna direkt efter.
  P.g.a att om jag inte nollställer så kommer variabelns värde vara något helt annat än vad det var från början då jag har valt att öka värdet efter varje iteration med ett
  bestämt värde. Detta betyder att nästa gång koden försöker rita ut knapparna igen så kommer de vara någon annanstans. Därför nollställer jag värdet med t.ex. initialValuesfordice
  för då blir det mycket enklare att referera till.
*/

// Nedanför förekommer variabler som används för att leta efter förändrignar i spelets GAMESTATE.

var canPlay = true;
var canPickItem = false; // Används som ett lås för Parameters()
var backPackIsfull = false;
var hasturnedallcards = false;
var gameOver = false;
var hasWon = false;
var gameHasStarted = false;


///////////////////////////////////////////////////////////////

// Nedanför förekommer variabler som saknar kategori

var pageNumber = 0;
var numberOfButtons = 0;
var imageCount = 0;
var secondimageCount = -1;

var diceList = [];
var diceValue = null;

var numberOfSlots = 32;
var imageSlots = 0;
var difficulty = "Easy";
var amountOfCards = 0;
updatesPerSecond = 10;

var JonasIndex = 0; // Håller koll vart Jonas är i kortleken.

var onceForDev = false;


///////////////////////////////////////////////////////////////


/*
 Funktionen FrontPage tar hand om att rita ut grafiken för knapparna på skärmen och att saker händer när man trycker på knapparna.

 Jag använder mig av en "while" vilkor som kör sitt kodblock sålänge antalet knappar inte är 3. Anledningen varför jag väljer att använda mig av
 en while vilkor istället för en for-loop är p.g.a funktionen FrontPage() körs hela tiden i Funktionen PageHandler() som i sig är innuti update.
 For-loopen innuti FrontPage() kommer därför att köras hela tiden och värdet på den deklarerade variablen kommer efter varje iteration att nollställas
 vilket i praktikten betyder att det kommer att ritas ut "oändligt" många knappar på skärmen.

Efter varaje iteration av while så ökas numberOfButtons med 1. När numberOfButtons ökar med 1 efter varje
iteration så kommer även nästa ord från textList[] att skrivas ut.
*/

  function FrontPage()
  {

    this.startButton = {x:totalWidth/2-125, y:totalHeight/2-120};

    while (numberOfButtons != 3)
    {
      rectangle(startButton.x, startButton.y, 250, 80, "black"); // Grafik
      rectangle(startButton.x+10, startButton.y+10, 230, 60, "red"); // Grafik
      text(startButton.x + 45, startButton.y + 60, 30, textList[numberOfButtons], "black");

      this.startButton.y += 150; // Distans i y-led till nästa knapp
      this.numberOfButtons += 1;
    }


    this.startButton = {x:totalWidth/2-125, y:totalHeight/2-120}; // Nollställer värdet för startButton till begynnelsevärden.
    /*
     Nollställningen behövs för att nästa gång knapparna ska ritas ut så ska de ritas ut på samma plats.
     Om det inte sker en nollställningen så kommer nästa knapp att ritas ut i y-led enligt följande: startButton.y+600.
     Vilket är under den tredje knappen.

     Samma sak gäller för alla nollställningar i min kod.
    */

    /*
    If-satserna nedanför kollar om anvädaren är inom ett område med sin mus samtidigt som vänsterklick är nedtryckt.
    Kodblocken under varje if-sats kör olika funktioner.

    Jag anväder mig av variabeln pageNumber för att veta vilken sida som ska ritas ut på skärmen. Se funktionen PageHandler() för att se hur det fungerar.

    */

    // Play knappen
    if(mouse.x >= startButton.x+10 && mouse.y >= startButton.y+10 && mouse.x <= startButton.x+10+230 && mouse.y <= startButton.y+10+60 && mouse.left) // Första knappen PLAY
    {
      clearScreen(); // Rensar skärmen på grafik
      // Visa funktioner finns här och andra under PageHandler(). Anledningen varför är p.g.a att här så vill jag att funktionerna ska köras en gång. Medans under PageHandler så ska de köras konstant.
      Backpack(); // Ritar ut backpacken
      FrontImageOnCard(); // Tar fram grafik för framsidan av korten och ritar ut på skärmen
      ChangeValuesDifficulty(); // Ändrar olika värden beroende på variablen difficulty
      RandomImageOnBackCard(); // Slumpar fram slumpmässiga kort från
      this.pageNumber = 1; // Se PageHandler();
      this.numberOfButtons = 7;
      this.startButton = {x:totalWidth/2-500, y:totalHeight/2+40}; // Används för att justera positionen för knapparna under funktionen EndScreen().
    }

    // Settings knappen
    if(mouse.x >= startButton.x+10 && mouse.y >= startButton.y+10+150 && mouse.x <= startButton.x+10+230 && mouse.y <= startButton.y+10+60+150 && mouse.left) // Andra knappen SETTINGS
    {
      this.pageNumber = 2; // Se PageHandler();
      //this.numberOfButtons = 0; // Nollställer antalet knappar, för nästa while-loop.
      clearScreen(); // Rensar skärmen på grafik.
    }

    // Exit knappen
    if(mouse.x >= startButton.x+10 && mouse.y >= startButton.y+10+300 && mouse.x <= startButton.x+10+460 && mouse.y <= startButton.y+10+60+300 && mouse.left) // Tredje knappen EXIT
    {
      window.close(); // stänger sidan, fick koden härifrån: https://stackoverflow.com/a/48912925
    }
  }

  /*
  Funktionen SettingsPage() tar hand om att rita ut knappar som väljer svårighetsgrad för spelet.

  Förklaringen varför jag har valt while istället för en for-loop hittar du ovanför funktionen FrontPage()
  */

  function SettingsPage()
  {
    while (numberOfButtons != 7)
    {
      rectangle(startButton.x, startButton.y, 250, 80, "black");
      rectangle(startButton.x+10, startButton.y+10, 230, 60, "red");
      text(startButton.x + 45, startButton.y + 60, 20, textList[numberOfButtons], "black");
      this.startButton.y += 150; // Distans i y-led till nästa knapp
      this.numberOfButtons += 1;
    }

    this.startButton = {x:totalWidth/2-125, y:totalHeight/2-120}; // Nollställer värdet för startButton till begynnelsevärden.
    // Easy knappen
    if(mouse.x >= startButton.x+10 && mouse.y >= startButton.y+10 && mouse.x <= startButton.x+10+230 && mouse.y <= startButton.y+10+60 && mouse.left)
    {
      this.difficulty = "Easy";
    }
    // Medium knappen
    if(mouse.x >= startButton.x+10 && mouse.y >= startButton.y+10+150 && mouse.x <= startButton.x+10+230 && mouse.y <= startButton.y+10+60+150 && mouse.left)
    {
      this.difficulty = "Medium";
    }
    // Hard knappen
    if(mouse.x >= startButton.x+10 && mouse.y >= startButton.y+10+300 && mouse.x <= startButton.x+10+460 && mouse.y <= startButton.y+10+60+300 && mouse.left)
    {
      this.difficulty = "Hard";
    }
    // Gå tillbaka! knappen
    if(mouse.x >= startButton.x+10 && mouse.y >= startButton.y+10+450 && mouse.x <= startButton.x+10+690 && mouse.y <= startButton.y+10+60+450 && mouse.left)
    {
      clearScreen();
      this.startButton = {x:totalWidth/2-125, y:totalHeight/2-120};
      this.numberOfButtons = 0;
      this.pageNumber = 0;
    }

      ///////////////////////////////////////////////
     // TODO bättre gränsnitt för svårighetsgrad! //
    ///////////////////////////////////////////////

    rectangle(totalWidth/2, 0, 200, 150, "white");
    text(totalWidth/2, 20, 20, difficulty, "black");
  }

/*
  Funktionen EndScreen() är den sista sidan. Sidan skriver ut med text() hurvida användaren har förlorat eller ej.

  När anvädaren har förlorat så körs den första if-satsen sitt kodblock. Vilket talar om att Jonas har dött och vilka/vilket kort som
  Jonas dog på. Men om användaren vinner så kör den andra if-satsen sitt kodblock där det står att användaren har vunnit.

  2 par knappar ritas även ut. Skillnaden mellan dessa knappar och de förra är att de är på samma y-position, men har en annan x-position.
  Jag har valt att skriva ut dessa knappar på skrämen så långt ifrån x och y positionerna för de knappar som ritas ut under funktionen FrontPage().
  Det blir alltså mycket svårare att råka starta ett nytt spel direkt efter att man är klar.
*/

  function EndScreen()
  {
    if(gameOver == true)
    {
      text(totalWidth/2-200, totalHeight/2-200, 40, "Jonas dog >:(", "black")
      text(totalWidth/2-800, totalHeight/2-150, 40, "Du hade inte tillräckligt med resurser för:", "black")
      text(totalWidth/2-800, totalHeight/2-100, 20, valueOfWrongCard, "black")
    }

    if(hasWon == true && gameOver == false)
    {
      text(totalWidth/2-200, totalHeight/2-200, 40, "Jaiy! Du vann :D", "black")
    }


    while (numberOfButtons != 9)
    {
      rectangle(startButton.x, startButton.y, 250, 80, "black");
      rectangle(startButton.x+10, startButton.y+10, 230, 60, "red");
      text(startButton.x + 45, startButton.y + 60, 20, textList[numberOfButtons], "black");
      this.startButton.x += 700; // Distans i x-led till nästa knapp
      this.numberOfButtons += 1;
    }
    // Startar om spelet knappen
    if(mouse.x >= startButton.x+10 && mouse.y >= startButton.y+10 && mouse.x <= startButton.x+10+230 && mouse.y <= startButton.y+10+60 && mouse.left)
    {
      clearScreen();
      this.pageNumber = 0; // startskärmen



      ////////////////////////////////
      // Nollställer viktiga värden //
      ////////////////////////////////

      this.valueOfWrongCard = [];
      this.itemsStoredInBackpack = [];
      this.itemsStoredRAM = [];
      this.imagesForCardBack = [];

      // Nedanför förekommer variabler som bestämmer olika föremåls positoner på skärmen.

      this.button = {x: totalWidth-250, y: totalHeight-150};

      this.backPackholder = {x: 10, y: totalHeight-240, w: 40, h: 40, dx: 60, dy: 90};
      this.initialValuesforbackPackholder = {x: 10, y: totalHeight-240, w: 40, h: 40, dx: 60, dy: 90};

      this.dice = {x: totalWidth/2+90, y:totalHeight-250, w:100, h:100, d: 130};
      this.initialValuesfordice = {x:totalWidth/2+90, y:totalHeight-250, w:100, h:100, d: 130};

      this.card = {x:totalWidth/2-600, y:totalHeight/2-160, w: 120, h:120};
      this.initialValuesforcardFront = {x:totalWidth/2-600, y:totalHeight/2-160, h: 120, w: 120};

      this.Jonas = {x:totalWidth/2-550, y:totalHeight/2-100, h: 20, w: 20};

      // Nedanför förekommer variabler som används för att leta efter förändrignar i spelets GAMESTATE.

      this.canPlay = true;
      this.canPickItem = false; // Används som ett lås för Parameters()
      this.backPackIsfull = false;
      this.hasturnedallcards = false;
      this.gameOver = false;
      this.gameHasStarted = false;

      ///////////////////////////////////////////////////////////////

      // Nedanför förekommer variabler som saknar kategori

      this.pageNumber = 0;
      this.numberOfButtons = 0;
      this.imageCount = 0;
      this.secondimageCount = -1;

      this.diceList = [];
      this.diceValue = null;

      this.numberOfSlots = 32;
      this.imageSlots = 0;
      this.amountOfCards = 0;

      this.JonasIndex = 0;

      this.onceForDev = false;


      ///////////////////////////////////////////////////////////////
    }
    // Exit knappen
    if(mouse.x >= startButton.x+10+700 && mouse.y >= startButton.y+10 && mouse.x <= startButton.x+10+230+700 && mouse.y <= startButton.y+10+60 && mouse.left)
    {
      window.close(); // stänger sidan, fick koden härifrån: https://stackoverflow.com/a/48912925
    }

    this.startButton = {x:totalWidth/2-500, y:totalHeight/2+40};
  }

  /*
  Funktionen ChangeValuesDifficulty() ändrar värden och tar hand om inställingarna i spelet.
  Värden ändras beroende på vilken svårighetsgrad användaren väljer.
  */

  function ChangeValuesDifficulty()
  {
    switch (difficulty) { // switch sats som kollar vilket värde variabeln difficulty har.
      case "Easy":
        this.amountOfCards = 8; // Antalet kort
        this.numberOfSlots -= 2; // tar bort 2 platser från backpacken
        for(var j = 0; j <= 1; j++) // itererar 2 gånger
        {
          picture(backPackholder.x, backPackholder.y, "Loki.png", backPackholder.w, backPackholder.h) // Skriver loki.png till en av platserna i backpacken
          this.backPackholder.x += backPackholder.dx; // Ökar backPackholder.x med backPackholder.dx (backPackholder.dx står för: backPackholder distans i x led)
        }
        break;
      case "Medium":
        this.amountOfCards = 10;
        this.numberOfSlots -= 4; // tar bort 4 platser från backpacken
        for(var j = 0; j <= 3; j++)
        {
          picture(backPackholder.x, backPackholder.y, "Loki.png", backPackholder.w, backPackholder.h)
          this.backPackholder.x += backPackholder.dx;
        }
        break;
      case "Hard":
        this.amountOfCards = 10; // Hard får inga loki kort så den lägger bara till 10 kort till amountOfCards variabeln.
        break;
    }
  }

  function FrontImageOnCard() // Tar hand om att rita ut grafiken på kortens framsida.
  {
    if(difficulty == "Easy") // Om användaren väljer svårighetsgraden "Easy" så kommer följande kodblock att köras:
    {
      for(var j = 0; j <= 8; j++) // for-loopen körs 9 gånger. Efter varje iteration så kollar if-satserna i kodblocket vilket värde j har.
                                  // Beroende på dess värde så ritas en specifik bild ut.
      {
        picture(card.x, card.y, imageForCardFront[1], 120, 120); // imageForCardFront[1] (vilket är ForestCardFront.png) ritas ut vid varje iteration medans resten av korten ritas ovanpå.
        if(j == 0)
        {
          picture(card.x, card.y, imageForCardFront[0], 120, 120);
        }

        if(j == 5)
        {
          picture(card.x, card.y, imageForCardFront[2], 120, 120);
        }

        if(j == 8)
        {
          picture(card.x, card.y, imageForCardFront[3], 120, 120);
        }
        card.x += 120;
      }
    }
    if (difficulty == "Medium" || difficulty == "Hard") // Både Medium och Hard har samma antal kort.
    {
      for(var j = 0; j <= 10; j++)
      {
        picture(card.x, card.y, imageForCardFront[1], 120, 120);
        if(j == 0)
        {
          picture(card.x, card.y, imageForCardFront[0], 120, 120);
        }

        if(j == 6)
        {
          picture(card.x, card.y, imageForCardFront[2], 120, 120);
        }

        if(j == 10)
        {
          picture(card.x, card.y, imageForCardFront[3], 120, 120);
        }
        card.x += 120;
      }
    }
    this.card = initialValuesforcardFront; // Nollställer till begynnelsevärden.
  }

  /*
  Följande 3 funktioner RandomForestCard, RandomWandererCard och RandomBossCard slumpar fram ett slumpmässigt kort till vektorn imagesForCardBack.

  Alla 3 funktioner följer ett allmänt mönster. En variebel skapas och får ett slumpmässigt värde beroende på den valda vektorns längden-1.
  Värdet på den här variabeln fungerar som en index för vektorn. Beroende på slumpade värdet på variablen så kommer det motsvara ett kort från vektorn (en sträng).
  Detta kort kommer nu att sparas i vektorn imagesForCardBack.

  Anledningen varför jag valde att skapa en variabeln kommer att vara väldigt för nästa steg. Nästa steg handlar om att
  ta bort kortet ur original vektorn. Detta innebär att jag måste veta indexen (positionen) från vart i original vektorn som jag tog kortet ifrån.
  Om jag inte sparade det slumpmässiga värdet i en variabel utan direkt skrev samma random metod igen så hade jag fått ett nytt slumpmässigt värde
  och det hade tagit bort ett helt annat kort ur vektorn.
  */

  function RandomForestCard() // Slumpar fram ett slumpmässigt kort till vektorn imagesForCardBack ur vektorn imageForForest.
  {
    var randomForestCard = random(imageForForest.length-1); // Skapar en variabel med ett slumpmässigt värde
    imagesForCardBack.push(imageForForest[randomForestCard]); // Får ut en sträng från vektron imageForForest av indexet som är värdet av variabeln.
    imageForForest.splice(randomForestCard, 1); // Tar bort strängen från original vektorn.
  }

  function RandomWandererCard() // Slumpar fram ett slumpmässigt kort till vektorn imagesForCardBack ur vektorn randomWandererCard.
  {
    var randomWandererCard = random(imageForWanderer.length-1);  // Skapar en variabel med ett slumpmässigt värde
    imagesForCardBack.push(imageForWanderer[randomWandererCard]); // Får ut en sträng från vektron imageForWanderer av indexet som är värdet av variabeln.
    imageForWanderer.splice(randomWandererCard, 1); // Tar bort strängen från original vektorn.
  }

  function RandomBossCard() // Slumpar fram ett slumpmässigt kort till vektorn imagesForCardBack ur vektorn randomBossCard.
  {
    var randomBossCard = random(imageForBoss.length-1); // Skapar en variabel med ett slumpmässigt värde
    imagesForCardBack.push(imageForBoss[randomBossCard]); // Får ut en sträng från vektron imageForBoss av indexet som är värdet av variabeln.
    imageForBoss.splice(randomBossCard, 1); // Tar bort strängen från original vektorn.
  }

  /*
  Funktionen RandomImageOnBackCard tar fram slumpmässiga kort på baksidan av korten.

  En for-loops iteration håller räkningen för vilka typer av kort (forest, wanderer eller boss) som ska sparas i vektorn imagesForCardBack.

  Jag har valt att anropa på funktioner istället för att skriva funktionernas kodblock under if-satserna mer p.g.a att det blir färre rader kod om jag återanvänder
  kod med funktioner.
  */

  function RandomImageOnBackCard()
  {
    imagesForCardBack.push("StartingCardBack.png");

    for(var j = 0; j <= amountOfCards; j++)
    {
      if(difficulty == "Easy")
      {
        if(j <= 3)
        {
          RandomForestCard();
        }
        if(j == 5)
        {
          RandomWandererCard();
        }
        if(j > 5 && j < 8)
        {
          RandomForestCard();
        }
        if(j == 8)
        {
          RandomBossCard();
        }
      }

      console.log(imagesForCardBack, imageForForest)

      if(difficulty == "Medium" || difficulty == "Hard")
      {
        if(j <= 4)
        {
          RandomForestCard();
        }
        if(j == 6)
        {
          RandomWandererCard();
        }
        if(j > 6 && j < 10)
        {
          RandomForestCard();
        }
        if(j == 10)
        {
          RandomBossCard();
        }
      }
    }
  }

  /*
  Funktionen TurnCard är till för att vända på ett kort när användaren trycker på knappen "vänd ett kort".

  GAMESTATE variablar och vektorer används i kombination med varandra för att kolla när koret kan vändas.

  Variabeln hasturnedallcards har ett boleant värde som förändras hurvida användaren har vänt på alla kort eller ej och det är en vikgit variabel för kodens logik.
  Om den första första if-satsen resulterar i ett falskt påstående så kommer selektionen i "else if" att testas. Den falska påståendet kan bero på en rad olika saker.

  Den första är att användaren inte trycker på knappen (vilket är mest troligt).

  Den andra selektorn (imageCount != amountOfCards) måste finnas för att ge ett falskt resultat för if-satsen när värdet av imageCount blir lika med värdet av amountOfCards.
  Eftersom när imageCount är lika med amountOfCards så vill jag stoppa vändningen av korten, då det inte finns några fler kort att rita ut (kommer ge en error ifall det försöker skriva ut kort som inte finns i en vektor).
  Däremot p.g.a den logiska operatorn != så kommer selektorn att resultera i ett sant resultat varje gång imageCount inte är lika med värdet av amountOfCards. Vilket tillåter if-satsens kodblock att köras.

  Den trejde selektorn kollar om hasturnedallcards är falskt. Variabelns värde förändras till true när användaren trycker på reset knappen. Vilket stoppar användaren från att vända på korten.

  Den fjärde men sista selektorn kollar om JonasIndex (hans positon på brädet, vilket är samma position som i imagesForCardBack) är lika med valueOfWrongCard[1] (vilket är den första positionen i imagesForCardBack som Jonas dog av).

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  När den andra selektorn ger ett falskt resultat så kommer kodens sekvens att gå vidare till else if-satsen. Båda selektorerna i else if-satsen kommer ge ett sant resultat vilket betyder att kodblocket kommer att köras.
  Samtidigt som selektionerna i else-if satsen ger sanna resultat så ritas reset knappen ut under funktionen WriteButton(). I kodblocket av else if-satsen så finns det en if-sats som kollar om användaren har tryckt på
  reset knappen. Om detta är sant så körs if-satsens kodblock. I kodblocket körs funktionen FrontImageOnCard() vilket ritar ut framsidan av kortet igen. Värden till variablar som hasturnedallcards och CanJonasMove ändras
  även under det här kodblocket. Vilket gör att användaren inte kan trycka på "vänd ett kort" knappen så att baksidan av kortet ritas ut. Då värdet av hasturnedallcards sätts till true vilket göra att resultatet av else if-satsen och
  den första if-satsen blir falskt.

  */

  function TurnCard()
  {
    if(mouse.x >= button.x+10 && mouse.y >= button.y-150+10 && mouse.x <= button.x+220 && mouse.y <= button.y-150+100 && mouse.left && imageCount != amountOfCards && hasturnedallcards == false && JonasIndex != valueOfWrongCard[1]) // Vänd kortet
    {
      // Den här delen vänder på ett kort både innan och efter att man har tryckt på reset knappen.
      this.imageCount += 1;
      this.card.x += 120;
      console.log(imageCount, imagesForCardBack.length-1, "-1", imagesForCardBack.length-2, "-2");
      picture(card.x, card.y, imagesForCardBack[imageCount], 120, 120);
      //
      if(gameHasStarted == true) // gameHasStarted sätts till true längre ner i samma funktion.
      {
        /*
         Den här delen ritar kortet (igen) som är ett kort bakom Jonas. Detta görs eftersom då läggs ett kort ovanför Jonas förra positon
         vilket i praktiken gör så att det ser ut som att jonas går framåt.

         Variablen imageCount (vars värde är indexet) måste däremot minska först med 1 för minskningen av värdet motsvarar ett steg åt vänster i
         vektorns position. Variabelns värde (vektorns index) går från x till x-1 vilket är positionen bakom x i vektorn. Kortets x-positon måste också minska till det var innan.

         Efter att kortet har ritats ut så ökar både kortets x-position och imageCount till vad det var innan minskingen. Detta sker p.g.a att nästa gång användaren trycker på "vänd ett kort" knappen så kommer
         nästa kort i imagesForCardBack att ritas ut. När vi ökar variabelns värde med 1 (vektorns index) så går värdet från x-1 till x-1+1 vilket då är x.
        */
        this.imageCount -= 1; // Minskar med 1 för att gå tillbaka i indexet för vektorn imagesForCardBack
        this.card.x -= 120; // Ändrar kortets x-positon till kortet som är vänster om det kort som Jonas är på för tillfället.
        picture(card.x, card.y, imagesForCardBack[imageCount], 120, 120) // Ritar ut kortet
        // Nollställer. Så att räkningen av korten är där den avslutade.
        this.imageCount += 1;
        this.card.x += 120;
        //

        MoveJonas(); // Funktion som flyttar på Jonas
      }
    } else if (imageCount == amountOfCards && hasturnedallcards == false) {
      this.card = {x:totalWidth/2-600, y:totalHeight/2-160};
      if(mouse.x >= button.x+10 && mouse.y >= button.y-300+10 && mouse.x <= button.x+220 && mouse.y <= button.y-300+100 && mouse.left) // reset
      {
        FrontImageOnCard();

        rectangle(button.x, button.y-300, 240, 120, "white");

        this.card = {x:totalWidth/2-600, y:totalHeight/2-160};
        this.imageCount = 0;
        this.hasturnedallcards = true;
      }
    }
    /*
      Kodblocket innuti if-satsen nedanför ritar ut StartingCardBack.png vilket är baksidan av det första kortet.
      Jag skulle kunna rita ut samma kort vid första gången användaren vänder på korten, men
      jag har valt med mening att rita StartingCardBack.png när Jonas ska börja röra på sig.

      If-satsen kör ifall ryggsäcken är full och värdet av gameHasStarted är falskt.
    */
    if(backPackIsfull == true && gameHasStarted == false)
    {
      picture(card.x, card.y, "StartingCardBack.png", 120, 120);
      this.gameHasStarted = true;
    }
  }

  /*
    Funktionen CanJonasMove är den största funktionen i min kod. Jag har valt att ha kvar console.log() ifall du
    vill se utdatan i konsolen.

    Poängen med den här funktionen är att jämföra två vektorer med varandra. Den ena vektorn är imagesForCardBack och den andra är itemsStoredInBackpack.
    Element från itemsStoredInBackpack byggs ihop i if-satserna med hjälp av '+'. Värdet av de deklarerade variablarna i for-looparna används för att referera till
    elementen i vektorn itemsStoredInBackpack. Det är i princip slumpmässigt när en jämförelse kan ske, men om vi testar för alla kombinationer så kommer det tillslut bli en
    korrekt jämförelse.

    Funktionen kör för varje element som finns i vektorn imagesForCardBack (se imagesForCardBack.forEach(CanJonasMove) under funktionen SaveItemToBackpack). Funktionen passerar även med
    parametrarna item och index. Item är vektorns elementet och index, elementets index.

    Funktionens kod är struktured på så sätt att när en if-sats resulterar i ett sant resultat så körs dess kodblock och slutet av kodblocket är "return" skriven. Med hjälp av "return" så kan man
    manipulera kodens sekevens. När "return" körs så hoppar den direkt ut ur funktionen, men eftersom vi kör en .forEach metod så kommer nästa element (från imagesForCardBack) direkt att passera in i funktionen CanJonasMove.
    Däremot om alla if-satserna resulterar i falskt (inget påstående stämmer) så kommer de sista raderna på slutet av funktionens kodblock att köras. Koden på de sista raderna talar bl.a om att
    spelaren har förlorat och säger vilka kort som sperlaren har förlorat på.

    If-satsernas kodblock (under for-looparna) tar sedan hand om att ta bort elementen från vektorn itemsStoredInBackpack. If-satsens kodblock skapar först en variabel där for-looparnas variablar sparas i en vektor
    som heter sortList. sortList sorteras sedan med .sort() metoden och utdatan sparas sedan i variabeln removeValFromIndex. Sorteringen är nödvändig då annars kommer fel element i vektorn itemsStoredInBackpack
    att tas bort. Koden går sen vidare till en for-loop vars iteration beror på längden av vektorn removeValFromIndex-1. Den här for-loopen är däremot lite speciell då den går igenom itemsStoredInBackpack
    baklänges och tar bort elementen. Efter att for-loopen är klar så körs "return" och nästa element från imagesForCardBack kommer att testas.

  */

  function CanJonasMove(item, index) // Används för att kolla om Jonas kan flytta på sig.
  {
    console.log(item, itemsStoredInBackpack)
    /*
      If-satserna nedanför tar hand om att "catcha" de fall som koden inte kan testa. T.ex. andra och tredje if-satsen som fångar fallet för backsidan av wanderer kortet i vektorn imagesForCardBack.
      Det måste finnas två if-satser för att easy och hard har olika många kort. Vilket betyder att positonen för wandererkortet är olika.
    */
    //
    if(item == imagesForCardBack[0])
    {
      console.log("returned starterCard")
      return;
    }

    if(difficulty == "Medium" && item == imagesForCardBack[6] || difficulty == "Hard" && item == imagesForCardBack[6])
    {
      console.log("returned difficulty")
      return;
    }

    if(difficulty == "Easy" && item == imagesForCardBack[5])
    {
      console.log("returned difficulty")
      return;
    }
    //

    for(var d = 0; d <= itemsStoredInBackpack.length-1; d++)
    {
      for(var j = 0; j <= itemsStoredInBackpack.length-1; j++)
      {
        if(itemsStoredInBackpack[d] + itemsStoredInBackpack[j] + "Forest.png" == item && j != d) // && j != d [...] behövs för att inte jämföra samma element.
        {
          console.log("SLICED 2")

          // Tog kod från den här hjälten på Stackoverflow https://stackoverflow.com/a/9425230
          var sortList = [d, j];
          var removeValFromIndex = sortList.sort()

          console.log(removeValFromIndex, "removeValFromIndex");

          for (var i = removeValFromIndex.length -1; i >= 0; i--)
          {
            itemsStoredInBackpack.splice(removeValFromIndex[i],1);
          }
          return;
        }
      }
    }

    for(var d = 0; d <= itemsStoredInBackpack.length-1; d++)
    {
      for(var j = 0; j <= itemsStoredInBackpack.length-1; j++)
      {
        for(var l = 0; l <= itemsStoredInBackpack.length-1; l++)
        {
        if(itemsStoredInBackpack[d] + itemsStoredInBackpack[j] + itemsStoredInBackpack[l] + "Forest.png" == item && d != j && j != l && l != d || itemsStoredInBackpack[d] + itemsStoredInBackpack[j] + itemsStoredInBackpack[l] + "Boss.png" == item && d != j && j != l && l != d)
        // && j != d [...] behövs för att inte jämföra samma element.
        {
          console.log("SLICED 3")

          // Tog kod från den här hjälten på Stackoverflow https://stackoverflow.com/a/9425230
          var sortList = [d, j, l];
          var removeValFromIndex = sortList.sort();

          console.log(removeValFromIndex, "removeValFromIndex");

          for(var i = removeValFromIndex.length -1; i >= 0; i--)
          {
            itemsStoredInBackpack.splice(removeValFromIndex[i],1);
          }
          return;
        }
      }
    }
  }

  for(var d = 0; d <= itemsStoredInBackpack.length-1; d++)
  {
    for(var j = 0; j <= itemsStoredInBackpack.length-1; j++)
    {
      for(var l = 0; l <= itemsStoredInBackpack.length-1; l++)
      {
        for(var u = 0; u <= itemsStoredInBackpack.length-1; u++)
        {
          if(itemsStoredInBackpack[d] + itemsStoredInBackpack[j] + itemsStoredInBackpack[l] + itemsStoredInBackpack[u] + "Forest.png" == item && d != j && j != l && l != u && d != l && d != u && j != u || itemsStoredInBackpack[d] + itemsStoredInBackpack[j] + itemsStoredInBackpack[l] + itemsStoredInBackpack[u] + "Boss.png" == item && d != j && j != l && l != u && d != l && d != u && j != u)
          // && j != d [...] behövs för att inte jämföra samma element.
          {
            console.log("SLICED 4")

            // Tog kod från den här hjälten på Stackoverflow https://stackoverflow.com/a/9425230
            var sortList = [d, j, l, u];
            var removeValFromIndex = sortList.sort();

            console.log(removeValFromIndex, "removeValFromIndex");

            for (var i = removeValFromIndex.length -1; i >= 0; i--)
            {
              itemsStoredInBackpack.splice(removeValFromIndex[i],1);
            }
            return;
        }
      }
    }
  }
}


  this.gameOver = true; // Talar om att användaren har förlorat spelet.
  valueOfWrongCard.push(item, index); // Kan lika gärna köra in index och item i samma vektor. Då valueOfWrongCard[0] kommer alltid vara det första elementet som användaren inte har tillräckligt med resuerser för och valueOfWrongCard[1] är indexet av elementet.

  console.log(gameOver, "GAMESTATE", valueOfWrongCard)
}
/*
  Funktionen MoveJonas styr Jonas röresle. Jonas är en gul rektangel.

  Jonas börjar röra på sig när användaren trycker på vänd ett kort knappen. Funktionen MoveJonas blir kallad under funktionen TurnCard() när den första if-satsen och den rotade if-satsen resulterar i ett sant påstående.
  Kortfattat så kan Jonas börja röra på sig efter att ryggsäcken är full. När Jonas rör på sig så ökar även värdet på JonasIndex vilket är ett sätt att hålla reda på vilket kort som Jonas är på.

  Den första if-satsen i funktionen MoveJonas() kollar om Jonas har hamnat på indexet av det felaktiga kortet (förlorar). Om detta resulterar i ett sant påstående så ändras pageNumber till värdet 3. Den andra kollar om Jonas har hamnat på slutet av kortleken. Om så är fallet
  så ändras också pageNumber till 3 och värdet på hasWon justeras till värdet true.

  Jag har valt att använda samma skärm både för när man vinner och förlorar. Eftersom det är enklare att referera till samma funktion i detta fall.

*/
  function MoveJonas()
  {
    rectangle(Jonas.x + 120, Jonas.y, Jonas.w, Jonas.h, "yellow");
    this.Jonas.x += 120;
    this.JonasIndex += 1;
    if(JonasIndex == valueOfWrongCard[1])
    {
      this.pageNumber = 3; // EndScreen();
      clearScreen();
    }
    if(JonasIndex == amountOfCards)
    {
      this.pageNumber = 3; // EndScreen();
      this.hasWon = true;
      clearScreen();
    }
  }

  function RandomImageOnDice() // Tar hand om att slumpa fram ett föremål på tärningen
  {
    for (var j = 0 ; j <= 3; j++) // for-loopen iterar 3 gånger igenom sitt kodblock
    {
      if (j == 2)
      {
        this.dice.y += dice.d;
        this.dice.x = initialValuesfordice.x;
      }

    this.diceValue = imageForDice[random(imageForDice.length)]; // Sätter in ett värde mellan (0-2)
    itemsStoredRAM.push(diceValue); // sätter in värdet från diceValue in i vektorn itemsStoredRAM.

    picture(dice.x, dice.y, diceValue + ".png", dice.w, dice.h); // bilden på föremålet
    this.dice.x += dice.d; // x-värdet ökar med 130 pixlar varje iteration. T.ex. så betyder det en skillnand på 150 pixlar x-led mellan den första och andra tärningen.

    }
    this.dice = initialValuesfordice;
  }

  /*
  Funktionen ClickOnDiceImage tar hand om att spara
  */

  function ClickOnDiceImage()
  {
    if(canPickItem == true) {

      if(mouse.x >= dice.x && mouse.y >= dice.y && mouse.x <= dice.x+dice.w && mouse.y <= dice.y+dice.h && mouse.left)
      {
        itemsStoredInBackpack.push(itemsStoredRAM[0]);
        this.itemsStoredRAM = [];
        this.canPickItem = false;
        SaveItemToBackpack();
      }

      if(mouse.x >= dice.x+dice.d && mouse.y >= dice.y && mouse.x <= dice.x+dice.d+dice.w && mouse.y <= dice.y+dice.h && mouse.left)
      {
        itemsStoredInBackpack.push(itemsStoredRAM[1]);
        this.itemsStoredRAM = [];
        this.canPickItem = false;
        SaveItemToBackpack();
      }

      if(mouse.x >= dice.x && mouse.y >= dice.y+dice.d && mouse.x <= dice.x+dice.w && mouse.y <= dice.y+dice.d+dice.h && mouse.left)
      {
        itemsStoredInBackpack.push(itemsStoredRAM[2]);
        this.itemsStoredRAM = [];
        this.canPickItem = false;
        SaveItemToBackpack();
      }

      if(mouse.x >= dice.x+dice.d && mouse.y >= dice.y+dice.d && mouse.x <= dice.x+dice.d+dice.w && mouse.y <= dice.y+dice.d+dice.h && mouse.left)
      {
        itemsStoredInBackpack.push(itemsStoredRAM[3]);
        this.itemsStoredRAM = [];
        this.canPickItem = false;
        SaveItemToBackpack();
      }
    }
  }


    function RollDice()
    {

      if(mouse.x >= button.x+10 && mouse.y >= button.y+10 && mouse.x <= button.x+220 && mouse.y <= button.y+100 && mouse.left && canPickItem == false && backPackIsfull == false && hasturnedallcards == true || keyboard.space == true && canPickItem == false && backPackIsfull == false && hasturnedallcards == true) // Play
      {

        RandomImageOnDice();

        this.canPickItem = true;
        this.dice = {x: totalWidth/2+90, y:totalHeight-250, w:100, h:100, d: 130};
      }
    }

  function SaveItemToBackpack()
  {
    if (imageSlots != numberOfSlots+1) // Det behövs lägga till en på numberOfSlots p.g.a att if-satsen måste köras en gång till när slots blir 32.
                                      // När slots blir 32 så körs inte kodblocket och ritar därför inte ut den sista bilden i backpacken.
                                      // Därför måste kodblocket köras en extra gång.
    {
      picture(backPackholder.x, backPackholder.y, itemsStoredInBackpack[imageSlots] + ".png", backPackholder.w, backPackholder.h)
      this.backPackholder.x += backPackholder.dx; // Flyttar bilden 30 pixlar till höger

      // if-satserna nedanför tar hand om att formatera raderna och kolumnerna.
      if(imageSlots == numberOfSlots-22) // Grafiken ritas ut i if-satsen kodblock på nästa rad när selektioen är sann.
      {
        this.backPackholder.y += backPackholder.dy; // mellanrum i y-led för bilden
        this.backPackholder.x = 10;
      }
      if(imageSlots == numberOfSlots-11) // Grafiken ritas ut i if-satsen kodblock på nästa rad när selektioen är sann.
      {
        this.backPackholder.y += backPackholder.dy;
        this.backPackholder.x = 10;
      } else if (numberOfSlots == imageSlots) {
        text(100, 100, 20, "Du är klar", "blue");
        imagesForCardBack.forEach(CanJonasMove);
        this.backPackIsfull = true;
        this.hasturnedallcards = false;
      }

      this.imageSlots += 1; // lägger till ett värde på imageSlots. Fungerar som en for-loop förutom att den bara går igenom en gång fullständigt.
    }
  }





  /*
  if-satserna nedanför innuti kodblocket Rolldice() kollar om musens x och y kordinater är inne i de båda rektanglarna och om anvädaren har tryckt vänster-klick eller om spacebaren är nertryckt.
  */

  function Backpack() // Grafiken av backpacken
  {
    for(var l = 0; l <= numberOfSlots; l++) // for-loop vars längd på iteration beror på värdet på numberOfSlots som sätts när anvädaren väljer svårighetsgrad.
    {
      rectangle(backPackholder.x, backPackholder.y, backPackholder.w, backPackholder.h, "blue"); // grafiken
      this.backPackholder.x += backPackholder.dx; // mellanrum i y-led för placeholdern
      if(l == numberOfSlots-22) // Grafiken ritas ut i if-satsen kodblock på nästa rad när selektioen är sann.
      {
        this.backPackholder.y += backPackholder.dy;
        this.backPackholder.x = 10; // nollställer värdet till begynnelse positionen
      }
      if(l == numberOfSlots-11) // Bilderna ritas ut i if-satsen kodblock på nästa rad när selektioen är sann.
      {
        this.backPackholder.y += backPackholder.dy;
        this.backPackholder.x = 10;
      }
    }

    this.backPackholder = initialValuesforbackPackholder; // nollställer backPackholder till dess begynnelse värde.

  }

  function WriteButton() // Grafiken av knapparna
  {
    // slå tärning knappen
    rectangle(button.x, button.y, 240, 120, "black");
    rectangle(button.x+10, button.y+10, 220, 100, "green");
    text(button.x+15, button.y+65, 20, "Slå tärningen", "yellow");

    // vänd korten knappen
    rectangle(button.x, button.y-150, 240, 120, "black");
    rectangle(button.x+10, button.y-150+10, 220, 100, "green");
    text(button.x+15, button.y-85, 20, "Vänd ett kort", "yellow");

    // Reset knappen
    if (imageCount == amountOfCards && hasturnedallcards == false && gameHasStarted == false)
    {
      rectangle(button.x, button.y-300, 240, 120, "black");
      rectangle(button.x+10, button.y-300+10, 220, 100, "green");
      text(button.x+25, button.y-230, 15, "Reset", "yellow");
    }
  }

  /*
  Funktionerna under PageHandler vill jag köra konstant under spelets gång.


  */

  function PageHandler()
  {
    switch (pageNumber) {
      case 0:
        FrontPage();
        break;
      case 1:
        RollDice();
        WriteButton();
        ClickOnDiceImage();
        TurnCard();
        break;
      case 2:
        SettingsPage();
        break;
      case 3:
      EndScreen();
        break;
    }
  }


  function update()
  {
    circle(200, 200, 20, "white")
    text(200, 200, 20, imageCount, "blue")
    //text(100, 250, 20, valueOfWrongCard, "black")
    text(100, 300, 20, imagesForCardBack[8], "black")


    PageHandler();
  }






  // Nästan all av min kod är skriven inne i funktioner. Då det blir mycket enklare att flesöka och återanväda kod. Funktionerna
  // blir sedan anropade varje sekund under update() funktionen som är en reserverad funktion.


</script>
