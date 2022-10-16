//controls health bar color
const healthBarColor = (barValue) => 
    barValue > 70 ? '#05D784' : (barValue > 40 ? '#F8C301': '#BF0100')

const app = Vue.createApp( { 
    data() {
        return {
            // game initializing properties
            startGame: false,
            playerLevel: "10",
            monsterLevel: "10",

            // game data properties
            levels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            gameLog: [],

            // player data properties
            playerHealth: 100,
            attackCount: 0,
            specialCount: 0,
            healsLeft: 3,
            damageDealt: 0,
            damageTaken: 0,

            // monster data properties
            monsterHealth: 100,
        }
    },

    methods: {
        //rand int
        rand(min, max) {
            return Math.floor(Math.random() * ((max - min) + 1) + min);
        },

        //level multiplier
        multiplier(level) {
            var dict = {"100":[10,20], "90":[9,19], "80":[8,17], "70":[7,16], "60":[6,15], "50":[5,14], "40":[4,13], "30":[3,12], "20":[2,11], "10":[1,10]}
            return dict[level]
        },

        // start
        start() {
            console.log("start")

            //toggle to new game
            this.startGame = true

            //reset values
            this.playerHealth = 100
            this.monsterHealth = 100
            this.attackCount = 0
            this.specialCount = 0
            this.healsLeft = 3
            this.damageDealt = 0
            this.damageTaken = 0
            this.gameLog = []
        },

        // attack!! event handler for Attack button
        attack() {
            console.log("attack")

            //generate random attack damage based on player level
            min = this.multiplier(this.playerLevel)[0]
            max = this.multiplier(this.playerLevel)[1]
            var damage = this.rand(min,max)

            //decrease monster health or defeat monster
            if((this.monsterHealth - damage) > 0){
                this.monsterHealth -= damage;
            }
            else{
                this.monsterHealth = 0
            }

            //update counters
            this.attackCount += 1
            this.damageDealt += damage

            //log action
            this.logAction("attack", "you", damage)

            //monster damages player
            this.monsterAttack()
        },

        // special attack. event handler for Special Attack button
        // special attack charges and can be used every 4 turns
        specialAttack() {
            console.log("special attack")

            //special attack does increased damage
            min = this.multiplier(this.playerLevel)[0] + 7
            max = this.multiplier(this.playerLevel)[1] + 3
            var damage = this.rand(min,max)

            //decrease monster health or defeat monster
            if((this.monsterHealth - damage) > 0){
                this.monsterHealth -= damage;
            }
            else{
                this.monsterHealth = 0;
            }

            //update counters
            this.attackCount -= 4
            this.damageDealt += damage
            this.specialCount += 1

            //log action
            this.logAction("specialAttack", "you", damage)
        },

        // heal. event handler for Heal button
        heal() {
            console.log("heal")

            //random heal amount
            var heal = this.rand(8,15)

            //add heal to player heal
            this.playerHealth += heal

            //update counters
            this.healsLeft -= 1
            this.damageTaken -= heal

            //log action
            this.logAction("heal", "you", heal)

        },

        // give up. event handler for Give up button
        giveUp() {
            var forfeit = confirm("Do you wish to give up and respawn?")
            if (forfeit) {
                this.start()
                this.startGame = false
                console.log("give up")
            } else {
                console.log("never give up")
                return false
            }

        },

        //monster attack
        monsterAttack() {
            //generate random monster damage based on level with higher min damage for balance
            min = this.multiplier(this.monsterLevel)[0] + 5
            max = this.multiplier(this.monsterLevel)[1]
            var damage = this.rand(min,max)

            //decrease player health or defeated
            if((this.playerHealth - damage) > 0){
                this.playerHealth -= damage;
            }
            else{
                this.playerHealth = 0;
            }

            //update damageTaken
            this.damageTaken += damage

            //log the monster attack
            this.logAction("attacked", "monster", damage)

        },

        //game logger
        logAction(event, name, number) {
            var action = {
                event: event,
                name: name,
                number, number
            }
            this.gameLog.push(action)
        }
    },

    computed: {

        //computes player health bar percentage and color
        playerHealthBar: function(){
            return {
                width: this.playerHealth + '%',
                backgroundColor: healthBarColor(this.playerHealth)
            }
        },

        //computes monster health bar percentage and color
        monsterHealthBar: function(){
            return {
                width: this.monsterHealth + '%',
                backgroundColor: healthBarColor(this.monsterHealth)
            }
        },

        //calculates total heals used
        healsUsed: function(){
            return 3 - this.healsLeft
        },

        //player or monster is defeated
        gameOver: function() {
            return this.playerHealth == 0 || this.monsterHealth == 0
        }
      },
});
const vm = app.mount("#app");
