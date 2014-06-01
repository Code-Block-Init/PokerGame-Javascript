var score = 100;
var dealt = false;
var hand = new Array(6);
var held = new Array(6);
var deck = new Array(53);
function DealDraw()
{
    if (dealt == true)
        Draw();
    else Deal();
}
function Deal()
{
    // fill the deck (in order, for now)
    for(i=1;i<14;i++)
    { // Filling the deck with cards
        deck[i] = new Card(i, "c");
        deck[i + 13] = new Card(i, "h");
        deck[i + 26] = new Card(i, "s");
        deck[i + 39] = new Card(i, "d");
    }
    // shuffle the deck
    var n = Math.floor(400 * Math.random() + 500);
    for(i=1;i<n;i++)
    {   // Choosing two random cards
        card1 = Math.floor(52 * Math.random() + 1);
        card2 = Math.floor(52 * Math.random() + 1);
        // Swapping
        temp = deck[card2];
        deck[card2] = deck[card1];
        deck[card1] = temp;
    }
    // deal and display cards
    for(i=1;i<6;i++)
    {
        hand[i] = deck[i]; // Assigning next card in the deck to the hand
        document.images[i].src = hand[i].fname(); // displaying dealt card
        document.images[i + 5].src = "images/hold.gif";
        held[i] = false; // resets held flag for the current card
    }
    dealt = true; // setting dealt flag
    //Subtracting bet from the total score
    score = score - 1; //deduct one for bet amount
    document.form1.total.value = score; // displaying score in text field
    document.images[11].src = "images/draw.gif"; // Changes deal button to draw button
    Addscore();
}
//hold or discard a card
function Hold(num)
{
    if (!dealt) // Toggling held flag for the card
        return;
    if(!held[num])
    {
        held[num] = true;
        document.images[5 + num].src = "images/hold.gif";
    }
    else
    {
        held[num] = false;
        document.images[5 + num].src = "images/hold2.gif";
    }
}
//Draw new cards
function Draw()
{
    // Setting a local variable called curcard for indicating next card to be drawn from the deck
    // Starts from 6 since 5 cards are already been drawn
    var curcard = 6; 
    for(i=1;i<6;i++)
    {
        // Checking each card's status in the held array
        if(!held[i]) // if the card isn't drawn
        { // replaced with next card from the deck
            hand[i] = deck[curcard++];
            document.images[i].src = hand[i].fname();
        }
    }
    // Preparing for next hand
    dealt = false;
    document.images[11].src = "images/deal.gif";
    // Calling Addscore function to calculate the score
    score += Addscore();
    document.form1.total.value = score;
}
//Make a filename for an image, given card object
function fname() //The function is defined that calculates file name for a card
{
    return this.num + this.suit + ".gif";
}
//constructor for card objects
function Card(num, suit) // defining card objects
{ // "deck" and "hand" arrays will store card object for each card
    this.num = num;
    this.suit = suit;
    this.fname = fname;
}
//Numeric sort function
function Numsort(a,b)
{
    return a - b;
}
// calculating score
/*
One pair : 1 point
Two pair : 2 points
Three of a kind : 3 points
Straight : 4 points
Flush : 5 points
Full house : 10 points
Four of a kind : 25 points
Straight flush : 50 points
Royal flush : 100 points
*/
function Addscore()
{
    // Initializing variables
    var straight = false;
    var flush = false;
    var pairs = 0;
    var three = false;
    var tally = new Array(14);
    //sorted array for convenience
    var nums = new Array(5);
    for(i=0;i<5;i++)
    {
        nums[i] = hand[i + 1].num;
    }
    nums.sort(Numsort);
    //Detecting flush --- all cards have same suit
    if (hand[1].suit == hand[2].suit && hand[2].suit == hand[3].suit && hand[3].suit == hand[4].suit && hand[4].suit == hand[5].suit)
        flush = true;
    //detecting straight (Ace low)
    if (nums[0] == nums[1] - 1 && nums[1] == nums[2] - 1 && nums[2] == nums[3] - 1 && nums[3] == nums[4] - 1)
        straight = true;
    //straight (Ace high)
    if (nums[0] == 1 && nums[1] == 10 && nums[2] == 11 && nums[3] == 12 && nums[4] == 13)
        straight = true;
    //royal flush, straight flush, straight, flush
    if(straight && flush && nums[4]==13 && nums[0]==1)
    {
        document.form1.message.value = "royal flush"; // royal flush --- {10, J, Q, K, A}
        return 100;
    }
    if(straight && flush)
    {
        document.form1.message.value = "straight flush";
        return 50;
    }
    if(straight)
    {
        document.form1.message.value = "straight";
        return 4;
    }
    if(flush)
    {
        document.form1.message.value = "flush";
        return 5;
    }
    // Creating an array and it's named as "tally"
    // tally array is a count for each card value
    for(i=1;i<14;i++)
    {
        tally[i] = 0;
    }
    for(i=0;i<5;i++)
    {
        tally[nums[i]] += 1;
    }
    for(i=1;i<14;i++)
    {
        if(tally[i]==4)
        {
            document.form1.message.value = "four of a kind";
            return 25;
        }
        if (tally[i] == 3)
            three = true;
        if (tally[i] == 2)
            pairs += 1;
    }
    if(three && pairs == 1)
    {
        document.form1.message.value = "full house";
        return 10;
    }
    if(pairs==2)
    {
        document.form1.message.value = "two pair";
        return 2;
    }
    if(three)
    {
        document.form1.message.value = "three of a kind";
        return 3;
    }
    if(pairs==1)
    {
        if(tally[1]==2 || tally[11]==2 || tally[12]==2 || tally[13]==2)
        {
            document.form1.message.value = "Jacks or better";
            return 1;
        }
    }
    document.form1.message.value = "no score"; // no scoring hand was detected
    return 0;
}
