# hexNoteG9
This is a format for music notation in hex.

|	HEX	|	Key for HexNote Values 	|
| ------------- | ------------- |
|	0	|	Comment/Goto 	|
|	1	|	Sharp/Flat	|
|	2	|	Dynamics 	|
|	3	|	Accents 	|
|	4	|	Defaults	|
|	5	|	Parens	|
|	6	|	Key Change/Chord	|
|	7	|	Octave	|
|	8	|	Rest	|
|	9	|	Note G	|
|	a	|	Note A	|
|	b	|	Note B	|
|	c	|	Note C	|
|	d	|	Note D	|
|	e	|	Note E	|
|	f	|	Note F	|

|beat on a	|	Value for beat 	| note description|
| ------------- | ------------- | -----------|
0a	|	default	|	default beat	|
1a	|	1/(2^1) = 1/2	|	half	|
2a	|	1/(2^2) = 1/4	|	quarter	|
3a	|	1/(2^3) = 1/8	|	eighth	|
4a	|	1/(2^4) = 1/16	|	sixteenth	|
5a	|	1/(2^5) = 1/32	|	thirty-second	|
6a	|	1/(2^6) = 1/64	|	sixty-fourth	|
7a	|	1/(2^7) = 1/128	|	one-twenty-eigth	|
8a	|	1/(2^8)=1/512	|	five-twelfth	|
9a	|		|	 1/12 triplet note	|
aa	|		|	 whole note	|
ba	|		|	 2 whole notes	|
ca	|		|	default beat (placeholder for later revisions)	|
da	|		|	default beat (placeholder for later revisions)	|
ea	|		|	default beat (placeholder for later revisions)	|
fa	|		|	default beat (placeholder for later revisions)	|

Number (hex) instance | Description | Example Description | Hex mask|
| ---------| --------| ---------| -------|
0|Keynotes(00)Comment(10)/GOTOs(20)/Measure Markers(30)  this instance is used to find beginning/ending of sections.|  For keynotes (1-88 notes from the keyboard), you will need to add a 00, so 14FF00 will play a dotted 16th note, keynote 255 %106.  You will also be able to do comments like  " B33F10 "  " ABBA10" , to name sections you could do "AB10" to begin section A and "AE20" to end section A.  Similar to MIPS, these labels are also used for GOTOs, only loop once per call, and ending with "20"  so "AB20" may go to "AB10" once. two times would be "AB20 AB20". This is needed to match sheet music such as D.C. al CAPA. Also Measure Markers (30) are used for placing staves on the staff. FF30 would be measure marker 255 and it would show up as a bar on the staff with 255 above it. |0x0000FF 
1|Sharp/Flat/Natural/Step up/down modifier. This instance sets the sharp or step for the next note.|"01C" or 11C " would be C sharp, "21 B" would be B natural " f1 C" would be C flat  See Sharp Step Modifier for more information.|0x000001
2|Dynamics Modifier. Volume of notes. This instance sets the following notes to mezzo forte. |"102" sets the notes to f (forte), " 2 " sets the following notes to mf . For more information on the range and ways to add crescendos and descendos, see Dynamics Modifier|0x000001
3|Accents Modifier tied, staccato, largo, slide, tremolo. This instance sets the tied default continue notes count (default 2)|(todo)|0x000001
4|Default Setter (beats, key, chord, continueNotes)  This instance sets the key to C, default beat to quarter note, chord to III , and continue notes to 2|Generally requires all the bits. " F3A34 "  (from left to right) would set the continue notes (notes to continue a modifier on for dynamics and volume) to F (15) , III to chord, A to key, 2^3 = 8 for 8th note default note. For more examples see Default Modifier. |0x000001
5|Parens Modifier begin/end (for chords, arpeggios, etc) This instance starts a paren "("|"05" or "5" is "(" a parens start, "15" is a parens end ")",  on the end parens, you want to express what the parens is for. By default it is for a chord. For more information, see the Parens Modifier  This requires at least 1 byte unless limiting the user to just 1 open paren at a time, which seems silly. |0x000001
6|Key change / chord modifier this instance sets the key of the following notes to the default key. |"A6" sets the key to "A". See Key Change Chord Modifier for more information|0x000001
7|Octave / Tempo stepper  modifier this instance increments octave by 1|"7" steps up the octave by 1 "a7" steps down the octave by one. "87" sets the octave to 8 ,  Technically this requires 1 byte (unless stepping 15 times until it rolls over )  "f7" keeps the octave the same, "FFf7" sets the tempo to 255 bpm while keeping the octave the same|0x000001
8|Rest / mute , this instance has the rest played for  default beat|"28" plays a 2^2 quarter rest, a "38" plays a 2^3 8th rest. "f8" turns the rest into a mute. "5f8" mutes the next 5 notes. see Rest Modifier for more information.|0x000001
9|Note G, played with default beat|"329 329 329" plays a 3*2^2 = 12th note , which three times makes a triplet on the "G" note. See Note for more information|0x000001
a|Note A, played with default beat|"12A" plays a dotted 2^2 =4 quarter note on A. See Note for more information|0x000001
b|Note B, played with default beat|"22B 3B" plays a tied 2^2=4 quarter note on B and ties this with a 2^3 =8 eighth note on B.  See Note for more information|0x000001
c|Note C, played with default beat|"C 0C 1C 2C 3C 4C 5C" the first 2 are the same and play the default note. If no default note is set this defaults to a quarter note. Some may prefer 2^0 =1 whole note defaults which can be set with the Default Modifier. the third note is a 2^1= 2 , half note on C. The fourth is a 2^2 = 4th note on C, the fifth is a 2^3=8 eighth note on C, the sixth  is a 16 note, the seventh is a 32nd note. See Note for more information|0x000001
d|Note D, played with default beat|"3D" plays  a 2^3 = 8 eighth note on D. See Note for more information|0x000001
e|Note E, played with default beat|"8E" plays a 256th note. Possibly useful  for slides or noise.  See Note for more information|0x000001
f|Note F, played with default beat|"1F" Plays a 2^1 = 2 half note on F. See Note for more information|0x000001
|||
1|Sharp Step Modifier|If you are going for just a half byte usage, you could go a step down and come up a step for a flat . @D is also C#|0x000011
11|    sharp||0x000011
21|    21 is take down by 2 half steps||0x000011
31|    31 is take down by 3 half steps ||0x000011
41|    41 is take down by 4 half steps||0x000011
51|    51 is take down by 5 half steps ||0x000011
61|    61 is take down by 6 half steps||0x000011
71|    71 is take down by 7 half steps||0x000011
81|    81 is natural (remove all modifiers/keys and just play the note)||0x000011
91|    91 is move up by 2 half steps ||0x000011
a1|    a1 : move up next note by 3 half steps||0x000011
b1|    b1 : move up next note by 4 half steps||0x000011
c1|    c1 : move up next note by 5 half steps||0x000011
d1|    d1 : move up next note by 6 half steps||0x000011
e1|    e1 : move up next node by 7 half steps ||0x000011
f1|    f1 : is flat, the next note will be lowered a half step.|“f1” is flat. “f1 b f1 e f1 a” is B flat, E flat, A flat. |0x000011
6f1|  the next 6 notes will be flat (lowered a half step) (may change)|“6f1 b e a d g c” is B flat, E flat, A flat, D flat, G flat, C flat|0x000011
9|G note||0x000011
9|G note played at default note (quarter)||0x000011
19|G note played at 1/ 2^1 , half note||0x000011
29|G note played at 1/ 2^2 ,quarter note||0x000011
39|G note played at 1/ 2^3 , eighth note||0x000011
49|G note played at 1/ 2^4 , sixteenth note||0x000011
59|G note played at 1/ 2^5 , 32nd note||0x000011
69|G note played at 1/ 2^6 , 64th note||0x000011
79|G note played at 1/ 2^7 , 128th note||0x000011
89|G note played at 1/ 2^8 , 256th note||0x000011
99|G note played as a 1/12 triplet note||0x000011
a9|G note played as a whole note||0x000011
b9|G note played as 2 whole notes||0x000011
c9|default beat (placeholder for later revisions)||0x000011
d9|default beat (placeholder for later revisions)||0x000011
e9|default beat (placeholder for later revisions)||0x000011
f9|default beat (placeholder for later revisions)||0x000011
109|G note played as a dotted default beat. ||0x000101
209|G note played with default beat (0), tied to next note (may change) ||0x000101
309|G note played with default beat (0) * 3 , if default was set to quarter note, this would be 1/3 of a triplet||0x000101
409|G note played with default beat(0) , flipping the denominator, so if the default was set to a quarter note, this would become 4 whole notes||0x000101
509|G note played with the previous notes' beat , if the previous note was a "4a" , this beat would become 2^4 = 16th note , if no note existed before this one, it would revert back to the default beat.  If previous note was also a 509, it would revert back to the beat before that. If starting with 509,and no previous notes exist, the previous note will be the default note.||0x000101
609|G note played , take the previous note (or rest) beat and divide by 2, if the beat does not fall in the range of 1/1024 - 16, default beat will be used. If beat is an irrational number, a math.floor() will round it down to the nearest whole number for the denominator. For example, a 2^3=8th will be 1/8*1/2 = 1/16th beat will be played. ||0x000101
709|G note played, take the previous note (or rest) beat and multiply by 2. 2^3 = 8th will become 1/8 * 2 = 2/8 = 1/4 , so a quarter note will be used. ||0x000101
809|G note played, take the previous note (or rest) beat and add it to this one. so 1/4 and 1/4 would become 2/4 =  1/2 ,  a half note||0x000101
909|G note played, take the previous note (or rest) beat and subtract it from this one.  if zero, default beat is used. If negative, the absolute value is used. 1/4-1/12 = 1/6th note. ||0x000101
0a09|play arpeggio up based on default(4) or keychange/Chord(6). For example, playing g up, with an indicator that the III position was to be used 306 , plays g a c, in whatever beat was specified, with flats and sharps added by key.   ||0x000101
1a09|play arpeggio down based on default(4) or keychange/Chord(6). 306 b09 will play the default key, III, and play g  e c,with octave change handled. This will not change the octave., it will revert back to its default state after the arpeggio is played.  This will have default beats.||0x000101
0b09|play a rock pattern up on the g chord. with default chord number||0x000101
1b09|play a rock pattern down on the g chord. with default chord number  ||0x000101
0c09|play notes between current note and previous note using current beat. defaults to 4 notes total. ||0x000101
1c09|play notes between current note and previous note. defaults to 4 notes total||0x000101
8c09|play 8 notes between current note and previous note using the default beat. if there are less than 10 half steps between notes, computation will shrink to fit a chromatic scale. Otherwise, it will attempt a regular scale. ||0x000101
d09|default modifier (does nothing) (placeholder for later revisions)||
e09|default modifier (does nothing) (placeholder for later revisions)||
f09|default modifier (does nothing) (placeholder for later revisions)||

Number (hex) instance | Description | Example Description | Hex mask|
| ---------| --------| ---------| -------|
10009|play octave 1 , note G , for default beat. This octave ties the note to the octave and does not influence any other note around it. ||
11011a|(from left to right) play octave 1 , play as a sharp, (open for number input), dotted, half note, a ||
00000a|Note ||
00001a|Beat ||
00010a|Beat extender||
00100a|Open number for input||
01000a|local sharp/flat /step modifier||
10000a|octave 1-15, 0 is default octave.||

# keynotes : 1-106 
Number (hex) instance | Description | Example Description | Hex mask|
| ---------| --------| ---------| -------|
|00FFa0| Play 255 keynote %106, a0 indicates a comment keynote| 0010a0 would be keynote 16, 1410a0 would be a dotted 2^4=16th note with a keynote of 16.| 00FFa0


