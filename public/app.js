
var myCanvas = document.getElementById("synth-pad");
var frequencyLabel  = document.getElementById('frequency');
var volumeLabel = document.getElementById('volume');
 window.AudioContext = window.AudioContext || window.webkitAudioContext;
var myAudioContext = new window.AudioContext();
var  oscillator = myAudioContext.createOscillator();
var gainNode = myAudioContext.createGain();
var hexInput = document.getElementyById('hexInput');
// test stuff
var test = []
var oscillators = [];
var playedOnce = false;
class SynthPad {
  
  constructor() {
   
  
        // Notes
        this.lowNote = 261.63; // C4
        this.highNote = 493.88; // B4
    console.log(document)
    //frequencyLabel = document.getElementById('frequency');
    //myCanvas = document.getElementById('synth-pad');

  
    // Create an audio context.
   
    this.setupEventListeners();
  
  

  };
    // Variables
   
    
   
  
  
    // Constructor
    
    
    
    // Event Listeners
     setupEventListeners() {
    
      // Disables scrolling on touch devices.
      document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
      }, false);
    
      myCanvas.addEventListener('mousedown', this.playChromaticScale(300));
      myCanvas.addEventListener('touchstart', this.playSound);
    
      myCanvas.addEventListener('mouseup', this.stopSound);
      document.addEventListener('mouseleave', this.stopSound);
      myCanvas.addEventListener('touchend', this.stopSound);
    };
    
    
    // Play a note.
    playSound (){
    
      //this.updateFrequency(event);
      oscillator.type = 'triangle';
      //gainNode = myAudioContext.createGain();
      //oscillator = myAudioContext.createOscillator();
      gainNode.connect(myAudioContext.destination);
      oscillator.connect(gainNode);
      if(!playedOnce){
        oscillator.start(0);
        playedOnce = true;
      }
     
      //oscillators.push(oscillator);
       //console.log("Played sound once... trying to connect");
       // gainNode.connect(myAudioContext.destination);
       // oscillator.connect(gainNode);
       //console.log("Played sound once... trying to connectssss");
       myCanvas.addEventListener('mousemove', this.updateFrequency);
       myCanvas.addEventListener('touchmove', this.updateFrequency);
   //}
    
     
    
      //myCanvas.addEventListener('mouseout', this.stopSound);
    };

    
    
    // Stop the audio.
   stopSound () {
      //oscillator.stop(0);
     
      try{
      gainNode.disconnect(myAudioContext.destination)
      oscillator.disconnect(gainNode);
      myCanvas.removeEventListener('mousemove', this.updateFrequency);
      myCanvas.removeEventListener('touchmove', this.updateFrequency);
      }catch(error){
        console.log("could not disconnect");
      }
     
      //myCanvas.removeEventListener('mouseout', this.stopSound);
    };
     sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
   async playChromaticScale(MSPerNote){
      
     this.playBasicHexNote([0xa,0xb,0xc,0xd,0xc,0xb,0xa],MSPerNote)
      // for(let keyNumber = 33; keyNumber < 77 ; keyNumber++){
      //  await this.sleep(MSPerNote);  
      //  this.playNote(keyNumber,MSPerNote, false);
      //   console.log("playing note")
      
        
      // }
      
   
      return ;
   } 
   async submitHex(){
    console.log(hexInput.getInnerText())
    var stringArray = hexInput.getInnerText().split(" ");
    stringArray.forEach(data=>{ data =this.basicStringToHex(data)})
    playBasicHexNote(stringArray, 500);

  }
  async playMain(){
    

  }
   async playBasicHexNote(hexArray,MSPerNote){
    if( typeof hexArray === 'string' ){
       hexArray.split(' ').forEach((item)=>{ item = basicStringToHex(item)});
    }
    for(let i = 0; i < hexArray.length ; i++){
      //await this.sleep(MSPerNote); 
      var hexNumber = hexArray[i]; 
      var keyNumber = this.noteNameToKeyNumber(this.basicHexToChar(hexNumber),2,0,0)
      var beatToMS  = this.beatToMS(this.basicHexToBeat(hexNumber),120)
      console.log("beatToMS is:"+ beatToMS);
      await this.playNote(keyNumber,beatToMS, true);
       console.log("playing note")
     
       
     }
   }

    beatToMS(beat, bpm){
      return beat/bpm*4*60*1000 // 1000 ms
      
    }
    basicHexToBeat(hexNumber){
      var mask = 0xF0;
      var beat = (hexNumber & mask)>>0x4
      var denominator = beat ;
      var flag =( hexNumber & 0xF00)>>8; // 4 bits is 1 place, 8 bits is 2 places
     
      var numBeat = 1/Math.pow(2,denominator); // not in spec, if 0 , do default
      console.log("basicHexToBeat flag is:"+ flag);
      var result = numBeat;
      switch(flag){
        case 0x0:
           return result;
        case 0x1:
          result = numBeat + numBeat/2
          break;
        case 0x2: 
          result = numBeat *2 // not in spec , placeholder
        case 0x3:
          result = numBeat * 3 // not in spec
      }
      return result;
    }

   playNote(keyNumber, lengthinMS, hardStop){
      var noteValue = this.keyNumberToFrequency(keyNumber);
      console.log(noteValue);
      var volumeValue = 50;
      oscillator.frequency.value = noteValue;
      gainNode.gain.value = 50;
      this.playSound();
      var stopper = this.stopSound;
      var wait = new Promise(resolve => {
        setTimeout(() => {
          console.log("in timeout")
          if(hardStop){  
            stopper();
          }
          else{
            gainNode.gain.value = 0;
          }
          return;
        }, lengthinMS);
      });
  
      var frequency =  Math.floor(noteValue*100)/100;
      frequencyLabel.innerHTML = frequency + ' Hz';
      volumeLabel.innerHTML = this.frequencyToNoteName(frequency, false);
      return wait;
    }
  
frequencyToNoteName(input, hasCents){
      if(isNaN(input) || (input == 0))
        return "<font color=\"red\">Enter a numerical value for frequency</font>";
      if((input < 27.5) || (input > 14080))
        return "<font color=\"red\">Enter a frequency in the range 27.5Hz (A0) and 14080Hz (A9)</font>";
      
      var A4 = 440.0;
      var A4_INDEX = 57;
  
      var notes = [
        "C0","C#0","D0","D#0","E0","F0","F#0","G0","G#0","A0","A#0","B0",
        "C1","C#1","D1","D#1","E1","F1","F#1","G1","G#1","A1","A#1","B1",
        "C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2",
        "C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3",
        "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",
        "C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5",
        "C6","C#6","D6","D#6","E6","F6","F#6","G6","G#6","A6","A#6","B6",
        "C7","C#7","D7","D#7","E7","F7","F#7","G7","G#7","A7","A#7","B7",
        "C8","C#8","D8","D#8","E8","F8","F#8","G8","G#8","A8","A#8","B8",
        "C9","C#9","D9","D#9","E9","F9","F#9","G9","G#9","A9","A#9","B9" ];
  
      var MINUS = 0;
      var PLUS = 1;
      
      var frequency;
      var r = Math.pow(2.0, 1.0/12.0);
      var cent = Math.pow(2.0, 1.0/1200.0);
      var r_index = 0;
      var cent_index = 0;
      var side;  
  
      frequency = A4;
    
      if(input >= frequency) {
        while(input >= r*frequency) {
          frequency = r*frequency;
          r_index++;
        }
        while(input > cent*frequency) {
          frequency = cent*frequency;
          cent_index++;
        }
        if((cent*frequency - input) < (input - frequency))
          cent_index++;
        if(cent_index > 50) {
          r_index++;
          cent_index = 100 - cent_index;
          if(cent_index != 0)
            side = MINUS;
          else
            side = PLUS;
        }
        else
          side = PLUS;
      }
    
      else {
        while(input <= frequency/r) {
          frequency = frequency/r;
          r_index--;
        }
        while(input < frequency/cent) {
          frequency = frequency/cent;
          cent_index++;
        }
        if((input - frequency/cent) < (frequency - input))
          cent_index++;
        if(cent_index >= 50) {
          r_index--;
          cent_index = 100 - cent_index;
          side = PLUS;
        }
        else {
          if(cent_index != 0)
            side = MINUS;
          else
            side = PLUS;
        }  
      }
    
      var result = notes[A4_INDEX + r_index];
      if(hasCents){
        if(side == PLUS)
          result = result + " plus ";
        else
          result = result + " minus ";
        result = result + cent_index + " cents";
      }
      return result;
    

  }
  async readBasicHex(hexArray){
    hexArray.forEach(async (hex) =>{
      await this.sleep(2000);  
      console.log("hex is" + hex.toString(16))
       this.basicHexToNote(hex);}
    )
    

  }
  basicHexToChar(hexNumber){
    var lastDigit = hexNumber & 0xF ;
    //console.log("last digit is:" + lastDigit);
    if(lastDigit == 9){
      return 'g';
    }
    return lastDigit.toString(16);
  }

  basicStringToHex(String){
    var hex = [];
    var result = 0;
    for(let i = 0 ; i < String.length; i++){
      
      var num = this.charToHex(String[i]+this.padZeroes(String.length-i))
      hex.push(num);
      result += num;
    }
    hex.forEach((data)=>{console.log(data.toString(16))})
    console.log(result.toString(16));
    return result;
  }

  padZeroes(number){
    var zeroes ="";
    for(let i = 1 ; i < number; i++){
      zeroes += "0";
    }
    return zeroes;
  }
  charToHex(char){
    if(char[0].toLowerCase() === 'g'){
      char = "9"+char.substring(1);
    }
    return parseInt("0x"+char.toLowerCase());
  }

  async basicHexToNote(hexNumber){
    var keyNumber = this.noteNameToKeyNumber(this.basicHexToChar(hexNumber),2,0,0)
    
    this.playNote(keyNumber, 1000, true);
    
  }

   playScale(scaleNoteToStartOn, isGoingUp, isGoingDown , isMajor){

   } 
   //convert note to sharps

   noteToKeyNumber(note){
    var sharps = 0;
    var flats = 0 ;
    var octave = 0;
    var myNote = ''
    var char = ''
    for(let i =0 ; i < note.length; i++){
      char = note[i];
      if(char == '#'){
        sharps++;
        continue;
      }
      if(char == '@'){
        flats++;
        continue;
      }
      else if(this.isNote(char)){
        myNote = char;
        continue;
      }
      else{
        octave = char;
        continue;
      }

    }
    console.log(myNote +":"+ octave+","+ sharps+","+ flats);
    return this.noteNameToKeyNumber(myNote,octave,sharps,flats)

   }
   isNote(note){
     switch(note){
       case 'a':
       case 'b':
       case 'c':
       case 'd':
       case 'e':
       case 'f':
       case 'g':
       return true;
     }
     return false;
   }
   noteNameToKeyNumber(note,octave, sharps, flats){
      var numNote = 0; 
  
      switch(note.toLowerCase() ){
         case 'a':
            numNote = 1;
            // if (octave ==8){
            //   numNote +=9;
            // }
            break;
         case 'b':
            numNote = 3;
            // if (octave ==8){
            //   numNote +=9;
            // }
            break;
         case 'c':
             numNote = 4;
            //  if(!octave){
            //   numNote+=85;
            //  }
            //  {
            //    numNote -=12;
            //  }
             break;
         case 'd':
             numNote = 6;
            //  if(!octave){
            //   numNote+=85;
            //   }
              //  if (octave ==8){
              //   numNote -=3;
              // }
              //else {
                //octave -=1;
             // }
            break;
         case 'e':
            numNote = 8;
            // if(!octave){
            //   numNote+=85
            // }
            // else if (octave ==8){
            //   numNote -=3;
            // }
           // else {
             // octave -=1;
           // }
            break;
         case 'f':
            numNote = 9;
            // if(!octave){
            //   numNote+=85
            // }
            // else if (octave ==8){
            //   numNote -=3;
            // }
            //else {
             // octave -=1;
           // }
            break;
         case 'g':
            numNote = 11
            // if(!octave){
            //   numNote+=85
            // }
            // if (octave ==8){
            //   numNote -=3;
            // }
            //else {
              //octave -=1;
            //}
            break;
       }
       
      console.log("numnote"+numNote);
      console.log((12*octave)+":"+octave);
       return ((numNote+sharps-flats)+12*octave) %109;

   }

    
    // Calculate the volume.
   calculateVolume (posY) {
      var volumeLevel = 1 - (((100 / myCanvas.offsetHeight) * (posY - myCanvas.offsetTop)) / 100);
      return volumeLevel;
    };
   keyNumberToNoteName(keyNumber, hasCents){
      return this.frequencyToNoteName(this.keyNumberToFrequency(keyNumber), hasCents);
   } 
   keyNumberToFrequency(n){
    
        return Math.pow(2,(n-49.0)/12.0)*440;

    };

    frequencyToKeyNumber(frequency){
        return 12*Math.log2(frequency/440) + 49
    };
 
    
    
    // Update the note frequency.
    updateFrequency (event) {
      if (event.type == 'mousedown' || event.type == 'mousemove') {
        //this.calculateFrequency(event.x, event.y);
      } else if (event.type == 'touchstart' || event.type == 'touchmove') {
        var touch = event.touches[0];
        //this.calculateFrequency(touch.pageX, touch.pageY);
      }
    };
    
    
    // Export this.
    //return SynthPad;
  };
  
  
  // Initialize the page.
  // if(document.readyState === "complete"){
  //   var synthPad = new SynthPad();
  // }
  window.onload=()=>{var synthPad = new SynthPad();}
  var synthPad = new SynthPad();
  