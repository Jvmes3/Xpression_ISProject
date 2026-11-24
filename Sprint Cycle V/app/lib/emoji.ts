export type EmojiItem = { emoji: string; name: string; tone: boolean };

export type EmojiGroup = { id: string; label: string; icon: string; items: EmojiItem[] };

function parse(block: string): EmojiItem[] {
  return block.trim().split("\n").map((line) => {
    const tone = line.startsWith("*");
    const text = tone ? line.slice(1) : line;
    const space = text.indexOf(" ");
    return {
      emoji: space === -1 ? text : text.slice(0, space),
      name: space === -1 ? "" : text.slice(space + 1),
      tone,
    };
  }).filter((item) => item.emoji);
}

const smileys = parse(`
😀 grinning face smile happy
😃 grinning face with big eyes smile happy
😄 grinning face with smiling eyes smile happy
😁 beaming face with smiling eyes grin
😆 grinning squinting face laugh
😅 grinning face with sweat
🤣 rolling on the floor laughing laugh
😂 face with tears of joy laugh
🙂 slightly smiling face
🙃 upside down face
🫠 melting face
😉 winking face
😊 smiling face with smiling eyes blush
😇 smiling face with halo
🥰 smiling face with hearts love
😍 smiling face with heart eyes love
🤩 star struck
😘 face blowing a kiss kiss
😗 kissing face kiss
😚 kissing face with closed eyes kiss
😙 kissing face with smiling eyes kiss
🥲 smiling face with tear
😋 face savoring food yum
😛 face with tongue
😜 winking face with tongue
🤪 zany face
😝 squinting face with tongue
🤑 money mouth face
🤗 smiling face with open hands hug
🤭 face with hand over mouth
🫢 face with open eyes and hand over mouth
🫣 face with peeking eye
🤫 shushing face quiet
🤔 thinking face
🫡 saluting face
🤐 zipper mouth face
🤨 face with raised eyebrow
😐 neutral face
😑 expressionless face
😶 face without mouth
🫥 dotted line face
😶‍🌫️ face in clouds
😏 smirking face
😒 unamused face
🙄 face with rolling eyes
😬 grimacing face
🤥 lying face
🫨 shaking face
😌 relieved face
😔 pensive face
😪 sleepy face
🤤 drooling face
😴 sleeping face
😷 face with medical mask sick
🤒 face with thermometer sick
🤕 face with head bandage hurt
🤢 nauseated face
🤮 face vomiting
🤧 sneezing face
🥵 hot face
🥶 cold face
🥴 woozy face
😵 face with crossed out eyes
🤯 exploding head
🤠 cowboy hat face
🥳 partying face
🥸 disguised face
😎 smiling face with sunglasses cool
🤓 nerd face
🧐 face with monocle
😕 confused face
🫤 face with diagonal mouth
😟 worried face
🙁 slightly frowning face
☹️ frowning face
😮 face with open mouth
😯 hushed face
😲 astonished face
😳 flushed face
🥺 pleading face
🥹 face holding back tears
😦 frowning face with open mouth
😧 anguished face
😨 fearful face
😰 anxious face with sweat
😥 sad but relieved face
😢 crying face
😭 loudly crying face
😱 face screaming in fear
😖 confounded face
😣 persevering face
😞 disappointed face
😓 downcast face with sweat
😩 weary face
😫 tired face
🥱 yawning face
😤 face with steam from nose
😡 enraged face angry
😠 angry face
🤬 face with symbols on mouth
😈 smiling face with horns
👿 angry face with horns
💀 skull
☠️ skull and crossbones
💩 pile of poo
🤡 clown face
👹 ogre
👺 goblin
👻 ghost
👽 alien
👾 alien monster
🤖 robot
😺 grinning cat
😸 grinning cat with smiling eyes
😹 cat with tears of joy
😻 smiling cat with heart eyes
😼 cat with wry smile
😽 kissing cat
🙀 weary cat
😿 crying cat
😾 pouting cat
🙈 see no evil monkey
🙉 hear no evil monkey
🙊 speak no evil monkey
💌 love letter
💘 heart with arrow
💝 heart with ribbon
💖 sparkling heart
💗 growing heart
💓 beating heart
💞 revolving hearts
💕 two hearts
💟 heart decoration
❣️ heart exclamation
💔 broken heart
❤️‍🔥 heart on fire
❤️‍🩹 mending heart
❤️ red heart
🩷 pink heart
🧡 orange heart
💛 yellow heart
💚 green heart
💙 blue heart
🩵 light blue heart
💜 purple heart
🤎 brown heart
🖤 black heart
🩶 grey heart
🤍 white heart
💋 kiss mark
💯 hundred points
💢 anger symbol
💥 collision
💫 dizzy
💦 sweat droplets
💨 dashing away
🕳️ hole
💣 bomb
💬 speech balloon
👁️‍🗨️ eye in speech bubble
🗨️ left speech bubble
🗯️ right anger bubble
💭 thought balloon
💤 zzz
`);

const people = parse(`
*👋 waving hand
*🤚 raised back of hand
*🖐️ hand with fingers splayed
*✋ raised hand
*🖖 vulcan salute
*🫱 rightwards hand
*🫲 leftwards hand
*🫳 palm down hand
*🫴 palm up hand
*👌 ok hand
*🤌 pinched fingers
*🤏 pinching hand
*✌️ victory hand
*🤞 crossed fingers
*🫰 hand with index finger and thumb crossed
*🤟 love you gesture
*🤘 sign of the horns
*🤙 call me hand
*👈 backhand index pointing left
*👉 backhand index pointing right
*👆 backhand index pointing up
*🖕 middle finger
*👇 backhand index pointing down
*☝️ index pointing up
*🫵 index pointing at the viewer
*👍 thumbs up
*👎 thumbs down
*✊ raised fist
*👊 oncoming fist
*🤛 left facing fist
*🤜 right facing fist
*👏 clapping hands
*🙌 raising hands
*🫶 heart hands
*👐 open hands
*🤲 palms up together
*🤝 handshake
*🙏 folded hands
*✍️ writing hand
*💅 nail polish
*🤳 selfie
*💪 flexed biceps
*🦾 mechanical arm
*🦿 mechanical leg
*🦵 leg
*🦶 foot
*👂 ear
*🦻 ear with hearing aid
*👃 nose
🧠 brain
🫀 anatomical heart
🫁 lungs
🦷 tooth
🦴 bone
👀 eyes
👁️ eye
👅 tongue
👄 mouth
*👶 baby
*🧒 child
*👦 boy
*👧 girl
*🧑 person
*👱 person blond hair
*👨 man
*🧔 man beard
*👩 woman
*🧓 older person
*👴 old man
*👵 old woman
*🙍 person frowning
*🙎 person pouting
*🙅 person gesturing no
*🙆 person gesturing ok
*💁 person tipping hand
*🙋 person raising hand
*🧏 deaf person
*🙇 person bowing
*🤦 person facepalming
*🤷 person shrugging
*👮 police officer
*🕵️ detective
*💂 guard
*🥷 ninja
*👷 construction worker
*🫅 person with crown
*🤴 prince
*👸 princess
*👳 person wearing turban
*👲 person with skullcap
*🧕 woman with headscarf
*🤵 person in tuxedo
*👰 person with veil
*🤰 pregnant woman
*🫃 pregnant man
*🫄 pregnant person
*🤱 breast feeding
*👼 baby angel
*🎅 santa claus
*🤶 mrs claus
*🦸 superhero
*🦹 supervillain
*🧙 mage
*🧚 fairy
*🧛 vampire
*🧜 merperson
*🧝 elf
*🧞 genie
*🧟 zombie
*💆 person getting massage
*💇 person getting haircut
*🚶 person walking
*🧍 person standing
*🧎 person kneeling
*🏃 person running
*💃 woman dancing
*🕺 man dancing
*🕴️ person in suit levitating
*👯 people with bunny ears
*🧖 person in steamy room
*🧗 person climbing
*🤺 person fencing
*🏇 horse racing
*⛷️ skier
*🏂 snowboarder
*🏌️ person golfing
*🏄 person surfing
*🚣 person rowing boat
*🏊 person swimming
*⛹️ person bouncing ball
*🏋️ person lifting weights
*🚴 person biking
*🚵 person mountain biking
*🤸 person cartwheeling
*🤼 people wrestling
*🤽 person playing water polo
*🤾 person playing handball
*🤹 person juggling
*🧘 person in lotus position
*🛀 person taking bath
*🛌 person in bed
👫 woman and man holding hands
👬 men holding hands
👭 women holding hands
💏 kiss
💑 couple with heart
👪 family
🗣️ speaking head
👤 bust in silhouette
👥 busts in silhouette
🫂 people hugging
`);

const animals = parse(`
🐵 monkey face
🐒 monkey
🦍 gorilla
🦧 orangutan
🐶 dog face
🐕 dog
🦮 guide dog
🐕‍🦺 service dog
🐩 poodle
🐺 wolf
🦊 fox
🦝 raccoon
🐱 cat face
🐈 cat
🐈‍⬛ black cat
🦁 lion
🐯 tiger face
🐅 tiger
🐆 leopard
🐴 horse face
🐎 horse
🦄 unicorn
🦓 zebra
🦌 deer
🦬 bison
🐮 cow face
🐂 ox
🐃 water buffalo
🐄 cow
🐷 pig face
🐖 pig
🐗 boar
🐽 pig nose
🐏 ram
🐑 ewe
🐐 goat
🐪 camel
🐫 two hump camel
🦙 llama
🦒 giraffe
🐘 elephant
🦣 mammoth
🦏 rhinoceros
🦛 hippopotamus
🐭 mouse face
🐁 mouse
🐀 rat
🐹 hamster
🐰 rabbit face
🐇 rabbit
🐿️ chipmunk
🦫 beaver
🦔 hedgehog
🦇 bat
🐻 bear
🐻‍❄️ polar bear
🐨 koala
🐼 panda
🦥 sloth
🦦 otter
🦨 skunk
🦘 kangaroo
🦡 badger
🐾 paw prints
🦃 turkey
🐔 chicken
🐓 rooster
🐣 hatching chick
🐤 baby chick
🐥 front facing baby chick
🐦 bird
🐧 penguin
🕊️ dove
🦅 eagle
🦆 duck
🦢 swan
🦉 owl
🦤 dodo
🪶 feather
🦩 flamingo
🦚 peacock
🦜 parrot
🪽 wing
🐦‍⬛ black bird
🪿 goose
🐸 frog
🐊 crocodile
🐢 turtle
🦎 lizard
🐍 snake
🐲 dragon face
🐉 dragon
🦕 sauropod
🦖 t rex
🐳 spout whale
🐋 whale
🐬 dolphin
🦭 seal
🐟 fish
🐠 tropical fish
🐡 blowfish
🦈 shark
🐙 octopus
🐚 shell
🪸 coral
🪼 jellyfish
🐌 snail
🦋 butterfly
🐛 bug
🐜 ant
🐝 honeybee
🪲 beetle
🐞 lady beetle
🦗 cricket
🪳 cockroach
🕷️ spider
🕸️ spider web
🦂 scorpion
🦟 mosquito
🪰 fly
🪱 worm
🦠 microbe
💐 bouquet
🌸 cherry blossom
💮 white flower
🪷 lotus
🏵️ rosette
🌹 rose
🥀 wilted flower
🌺 hibiscus
🌻 sunflower
🌼 blossom
🌷 tulip
🪻 hyacinth
🌱 seedling
🪴 potted plant
🌲 evergreen tree
🌳 deciduous tree
🌴 palm tree
🌵 cactus
🌾 sheaf of rice
🌿 herb
☘️ shamrock
🍀 four leaf clover
🍁 maple leaf
🍂 fallen leaf
🍃 leaf fluttering in wind
🪹 empty nest
🪺 nest with eggs
🍄 mushroom
`);

const food = parse(`
🍇 grapes
🍈 melon
🍉 watermelon
🍊 tangerine
🍋 lemon
🍌 banana
🍍 pineapple
🥭 mango
🍎 red apple
🍏 green apple
🍐 pear
🍑 peach
🍒 cherries
🍓 strawberry
🫐 blueberries
🥝 kiwi fruit
🍅 tomato
🫒 olive
🥥 coconut
🥑 avocado
🍆 eggplant
🥔 potato
🥕 carrot
🌽 ear of corn
🌶️ hot pepper
🫑 bell pepper
🥒 cucumber
🥬 leafy green
🥦 broccoli
🧄 garlic
🧅 onion
🥜 peanuts
🫘 beans
🌰 chestnut
🫚 ginger
🫛 pea pod
🍞 bread
🥐 croissant
🥖 baguette bread
🫓 flatbread
🥨 pretzel
🥯 bagel
🥞 pancakes
🧇 waffle
🧀 cheese wedge
🍖 meat on bone
🍗 poultry leg
🥩 cut of meat
🥓 bacon
🍔 hamburger
🍟 french fries
🍕 pizza
🌭 hot dog
🥪 sandwich
🌮 taco
🌯 burrito
🫔 tamale
🥙 stuffed flatbread
🧆 falafel
🥚 egg
🍳 cooking
🥘 shallow pan of food
🍲 pot of food
🫕 fondue
🥣 bowl with spoon
🥗 green salad
🍿 popcorn
🧈 butter
🧂 salt
🥫 canned food
🍱 bento box
🍘 rice cracker
🍙 rice ball
🍚 cooked rice
🍛 curry rice
🍜 steaming bowl
🍝 spaghetti
🍠 roasted sweet potato
🍢 oden
🍣 sushi
🍤 fried shrimp
🍥 fish cake with swirl
🥮 moon cake
🍡 dango
🥟 dumpling
🥠 fortune cookie
🥡 takeout box
🦀 crab
🦞 lobster
🦐 shrimp
🦑 squid
🦪 oyster
🍦 soft ice cream
🍧 shaved ice
🍨 ice cream
🍩 doughnut
🍪 cookie
🎂 birthday cake
🍰 shortcake
🧁 cupcake
🥧 pie
🍫 chocolate bar
🍬 candy
🍭 lollipop
🍮 custard
🍯 honey pot
🍼 baby bottle
🥛 glass of milk
☕ hot beverage
🫖 teapot
🍵 teacup without handle
🍶 sake
🍾 bottle with popping cork
🍷 wine glass
🍸 cocktail glass
🍹 tropical drink
🍺 beer mug
🍻 clinking beer mugs
🥂 clinking glasses
🥃 tumbler glass
🫗 pouring liquid
🥤 cup with straw
🧋 bubble tea
🧃 beverage box
🧉 mate
🧊 ice
🥢 chopsticks
🍽️ fork and knife with plate
🍴 fork and knife
🥄 spoon
🔪 kitchen knife
🫙 jar
`);

const activity = parse(`
⚽ soccer ball
🏀 basketball
🏈 american football
⚾ baseball
🥎 softball
🎾 tennis
🏐 volleyball
🏉 rugby football
🥏 flying disc
🎱 pool 8 ball
🪀 yo yo
🏓 ping pong
🏸 badminton
🏒 ice hockey
🏑 field hockey
🥍 lacrosse
🏏 cricket game
🥅 goal net
⛳ flag in hole
🪁 kite
🏹 bow and arrow
🎣 fishing pole
🤿 diving mask
🥊 boxing glove
🥋 martial arts uniform
🎽 running shirt
🛹 skateboard
🛼 roller skate
🛷 sled
⛸️ ice skate
🥌 curling stone
🎿 skis
⛷️ skier
🏂 snowboarder
🪂 parachute
🏋️ person lifting weights
🤼 people wrestling
🤸 person cartwheeling
⛹️ person bouncing ball
🤺 person fencing
🤾 person playing handball
🏌️ person golfing
🏇 horse racing
🧘 person in lotus position
🏄 person surfing
🏊 person swimming
🤽 person playing water polo
🚣 person rowing boat
🧗 person climbing
🚵 person mountain biking
🚴 person biking
🏆 trophy
🥇 1st place medal
🥈 2nd place medal
🥉 3rd place medal
🏅 sports medal
🎖️ military medal
🏵️ rosette
🎗️ reminder ribbon
🎫 ticket
🎟️ admission tickets
🎪 circus tent
🤹 person juggling
🎭 performing arts
🩰 ballet shoes
🎨 artist palette
🎬 clapper board
🎤 microphone
🎧 headphone
🎼 musical score
🎹 musical keyboard
🥁 drum
🪘 long drum
🎷 saxophone
🎺 trumpet
🪗 accordion
🎸 guitar
🪕 banjo
🎻 violin
🎲 game die
♟️ chess pawn
🎯 direct hit
🎳 bowling
🎮 video game
🎰 slot machine
🧩 puzzle piece
`);

const travel = parse(`
🚗 automobile
🚕 taxi
🚙 sport utility vehicle
🚌 bus
🚎 trolleybus
🏎️ racing car
🚓 police car
🚑 ambulance
🚒 fire engine
🚐 minibus
🛻 pickup truck
🚚 delivery truck
🚛 articulated lorry
🚜 tractor
🏍️ motorcycle
🛵 motor scooter
🚲 bicycle
🛴 kick scooter
🛹 skateboard
🛼 roller skate
🚏 bus stop
🛣️ motorway
🛤️ railway track
🛢️ oil drum
⛽ fuel pump
🛞 wheel
🚨 police car light
🚥 horizontal traffic light
🚦 vertical traffic light
🛑 stop sign
🚧 construction
⚓ anchor
🛟 ring buoy
⛵ sailboat
🛶 canoe
🚤 speedboat
🛳️ passenger ship
⛴️ ferry
🛥️ motor boat
🚢 ship
✈️ airplane
🛩️ small airplane
🛫 airplane departure
🛬 airplane arrival
🪂 parachute
💺 seat
🚁 helicopter
🚟 suspension railway
🚠 mountain cableway
🚡 aerial tramway
🛰️ satellite
🚀 rocket
🛸 flying saucer
🛎️ bellhop bell
🧳 luggage
⌛ hourglass done
⏳ hourglass not done
⌚ watch
⏰ alarm clock
⏱️ stopwatch
⏲️ timer clock
🕰️ mantelpiece clock
🕛 twelve oclock
🕧 twelve thirty
🕐 one oclock
🌍 globe showing europe africa
🌎 globe showing americas
🌏 globe showing asia australia
🌐 globe with meridians
🗺️ world map
🧭 compass
🏔️ snow capped mountain
⛰️ mountain
🌋 volcano
🗻 mount fuji
🏕️ camping
🏖️ beach with umbrella
🏜️ desert
🏝️ desert island
🏞️ national park
🏟️ stadium
🏛️ classical building
🏗️ building construction
🧱 brick
🪨 rock
🪵 wood
🛖 hut
🏘️ houses
🏚️ derelict house
🏠 house
🏡 house with garden
🏢 office building
🏣 japanese post office
🏤 post office
🏥 hospital
🏦 bank
🏨 hotel
🏩 love hotel
🏪 convenience store
🏫 school
🏬 department store
🏭 factory
🏯 japanese castle
🏰 castle
💒 wedding
🗼 tokyo tower
🗽 statue of liberty
⛪ church
🕌 mosque
🛕 hindu temple
🕍 synagogue
⛩️ shinto shrine
🕋 kaaba
⛲ fountain
⛺ tent
🌁 foggy
🌃 night with stars
🏙️ cityscape
🌄 sunrise over mountains
🌅 sunrise
🌆 cityscape at dusk
🌇 sunset
🌉 bridge at night
♨️ hot springs
🎠 carousel horse
🛝 playground slide
🎡 ferris wheel
🎢 roller coaster
💈 barber pole
🎪 circus tent
`);

const objects = parse(`
👓 glasses
🕶️ sunglasses
🥽 goggles
🥼 lab coat
🦺 safety vest
👔 necktie
👕 t shirt
👖 jeans
🧣 scarf
🧤 gloves
🧥 coat
🧦 socks
👗 dress
👘 kimono
🥻 sari
🩱 one piece swimsuit
🩲 briefs
🩳 shorts
👙 bikini
👚 woman clothes
🪭 folding hand fan
👛 purse
👜 handbag
👝 clutch bag
🛍️ shopping bags
🎒 backpack
🩴 thong sandal
👞 man shoe
👟 running shoe
🥾 hiking boot
🥿 flat shoe
👠 high heeled shoe
👡 woman sandal
🩰 ballet shoes
👢 woman boot
👑 crown
👒 woman hat
🎩 top hat
🎓 graduation cap
🧢 billed cap
🪖 military helmet
⛑️ rescue worker helmet
📿 prayer beads
💄 lipstick
💍 ring
💎 gem stone
🔇 muted speaker
🔈 speaker low volume
🔉 speaker medium volume
🔊 speaker high volume
📢 loudspeaker
📣 megaphone
📯 postal horn
🔔 bell
🔕 bell with slash
🎼 musical score
🎵 musical note
🎶 musical notes
🎙️ studio microphone
🎚️ level slider
🎛️ control knobs
🎤 microphone
🎧 headphone
📻 radio
🎷 saxophone
🪗 accordion
🎸 guitar
🎹 musical keyboard
🎺 trumpet
🎻 violin
🪕 banjo
🥁 drum
🪘 long drum
📱 mobile phone
📲 mobile phone with arrow
☎️ telephone
📞 telephone receiver
📟 pager
📠 fax machine
🔋 battery
🪫 low battery
🔌 electric plug
💻 laptop
🖥️ desktop computer
🖨️ printer
⌨️ keyboard
🖱️ computer mouse
🖲️ trackball
💽 computer disk
💾 floppy disk
💿 optical disk
📀 dvd
🧮 abacus
🎥 movie camera
🎞️ film frames
📽️ film projector
🎬 clapper board
📺 television
📷 camera
📸 camera with flash
📹 video camera
📼 videocassette
🔍 magnifying glass tilted left
🔎 magnifying glass tilted right
🕯️ candle
💡 light bulb
🔦 flashlight
🏮 red paper lantern
🪔 diya lamp
📔 notebook with decorative cover
📕 closed book
📖 open book
📗 green book
📘 blue book
📙 orange book
📚 books
📓 notebook
📒 ledger
📃 page with curl
📜 scroll
📄 page facing up
📰 newspaper
🗞️ rolled up newspaper
📑 bookmark tabs
🔖 bookmark
🏷️ label
💰 money bag
🪙 coin
💴 yen banknote
💵 dollar banknote
💶 euro banknote
💷 pound banknote
💸 money with wings
💳 credit card
🧾 receipt
💹 chart increasing with yen
✉️ envelope
📧 e mail
📨 incoming envelope
📩 envelope with arrow
📤 outbox tray
📥 inbox tray
📦 package
📫 closed mailbox with raised flag
📪 closed mailbox with lowered flag
📬 open mailbox with raised flag
📭 open mailbox with lowered flag
📮 postbox
🗳️ ballot box with ballot
✏️ pencil
✒️ black nib
🖋️ fountain pen
🖊️ pen
🖌️ paintbrush
🖍️ crayon
📝 memo
💼 briefcase
📁 file folder
📂 open file folder
🗂️ card index dividers
📅 calendar
📆 tear off calendar
🗒️ spiral notepad
🗓️ spiral calendar
📇 card index
📈 chart increasing
📉 chart decreasing
📊 bar chart
📋 clipboard
📌 pushpin
📍 round pushpin
📎 paperclip
🖇️ linked paperclips
📏 straight ruler
📐 triangular ruler
✂️ scissors
🗃️ card file box
🗄️ file cabinet
🗑️ wastebasket
🔒 locked
🔓 unlocked
🔏 locked with pen
🔐 locked with key
🔑 key
🗝️ old key
🔨 hammer
🪓 axe
⛏️ pick
⚒️ hammer and pick
🛠️ hammer and wrench
🗡️ dagger
⚔️ crossed swords
💣 bomb
🪃 boomerang
🏹 bow and arrow
🛡️ shield
🪚 carpentry saw
🔧 wrench
🪛 screwdriver
🔩 nut and bolt
⚙️ gear
🗜️ clamp
⚖️ balance scale
🦯 white cane
🔗 link
⛓️ chains
🪝 hook
🧰 toolbox
🧲 magnet
🪜 ladder
⚗️ alembic
🧪 test tube
🧫 petri dish
🧬 dna
🔬 microscope
🔭 telescope
📡 satellite antenna
💉 syringe
🩸 drop of blood
💊 pill
🩹 adhesive bandage
🩼 crutch
🩺 stethoscope
🩻 x ray
🚪 door
🛗 elevator
🪞 mirror
🪟 window
🛏️ bed
🛋️ couch and lamp
🪑 chair
🚽 toilet
🪠 plunger
🚿 shower
🛁 bathtub
🪤 mouse trap
🪒 razor
🧴 lotion bottle
🧷 safety pin
🧹 broom
🧺 basket
🧻 roll of paper
🪣 bucket
🧼 soap
🫧 bubbles
🪥 toothbrush
🧽 sponge
🧯 fire extinguisher
🛒 shopping cart
🚬 cigarette
⚰️ coffin
🪦 headstone
⚱️ funeral urn
🧿 nazar amulet
🪬 hamsa
🗿 moai
🪧 placard
🪪 identification card
`);

const symbols = parse(`
💘 heart with arrow
❤️ red heart
🧡 orange heart
💛 yellow heart
💚 green heart
💙 blue heart
💜 purple heart
🖤 black heart
🤍 white heart
🤎 brown heart
💔 broken heart
❣️ heart exclamation
💕 two hearts
💞 revolving hearts
💓 beating heart
💗 growing heart
💖 sparkling heart
💘 cupid
💝 heart with ribbon
💟 heart decoration
☮️ peace symbol
✝️ latin cross
☪️ star and crescent
🕉️ om
☸️ wheel of dharma
✡️ star of david
🔯 dotted six pointed star
🕎 menorah
☯️ yin yang
☦️ orthodox cross
🛐 place of worship
⛎ ophiuchus
♈ aries
♉ taurus
♊ gemini
♋ cancer
♌ leo
♍ virgo
♎ libra
♏ scorpio
♐ sagittarius
♑ capricorn
♒ aquarius
♓ pisces
🆔 id button
⚛️ atom symbol
🉑 accept button
☢️ radioactive
☣️ biohazard
📴 mobile phone off
📳 vibration mode
🈶 not free of charge
🈚 free of charge
🈸 application
🈺 open for business
🈷️ monthly amount
✴️ eight pointed star
🆚 vs button
💮 white flower
🉐 bargain
㊙️ secret
㊗️ congratulations
🈴 passing grade
🈵 no vacancy
🈹 discount
🈲 prohibited
🅰️ a button
🅱️ b button
🆎 ab button
🆑 cl button
🅾️ o button
🆘 sos button
❌ cross mark
⭕ hollow red circle
🛑 stop sign
⛔ no entry
📛 name badge
🚫 prohibited
💯 hundred points
💢 anger symbol
♨️ hot springs
🚷 no pedestrians
🚯 no littering
🚳 no bicycles
🚱 non potable water
🔞 no one under eighteen
📵 no mobile phones
🚭 no smoking
❗ exclamation mark
❕ white exclamation mark
❓ question mark
❔ white question mark
‼️ double exclamation mark
⁉️ exclamation question mark
🔅 dim button
🔆 bright button
〽️ part alternation mark
⚠️ warning
🚸 children crossing
🔱 trident emblem
⚜️ fleur de lis
🔰 japanese symbol for beginner
♻️ recycling symbol
✅ check mark button
🈯 reserved
💹 chart increasing with yen
❇️ sparkle
✳️ eight spoked asterisk
❎ cross mark button
🌐 globe with meridians
💠 diamond with a dot
Ⓜ️ circled m
🌀 cyclone
💤 zzz
🏧 atm sign
🚾 water closet
♿ wheelchair symbol
🅿️ p button
🛗 elevator
🈳 vacancy
🈂️ service charge
🛂 passport control
🛃 customs
🛄 baggage claim
🛅 left luggage
🚹 men room
🚺 women room
🚼 baby symbol
⚧ transgender symbol
🚻 restroom
🚮 put litter in its place
🎦 cinema
📶 antenna bars
🈁 here button
🔣 input symbols
ℹ️ information
🔤 input latin letters
🔡 input latin lowercase
🔠 input latin uppercase
🆖 ng button
🆗 ok button
🆙 up button
🆒 cool button
🆕 new button
🆓 free button
0️⃣ keycap 0
1️⃣ keycap 1
2️⃣ keycap 2
3️⃣ keycap 3
4️⃣ keycap 4
5️⃣ keycap 5
6️⃣ keycap 6
7️⃣ keycap 7
8️⃣ keycap 8
9️⃣ keycap 9
🔟 keycap 10
🔢 input numbers
#️⃣ keycap hash
*️⃣ keycap asterisk
⏏️ eject button
▶️ play button
⏸️ pause button
⏯️ play or pause button
⏹️ stop button
⏺️ record button
⏭️ next track button
⏮️ last track button
⏩ fast forward button
⏪ fast reverse button
⏫ fast up button
⏬ fast down button
◀️ reverse button
🔼 upwards button
🔽 downwards button
➡️ right arrow
⬅️ left arrow
⬆️ up arrow
⬇️ down arrow
↗️ up right arrow
↘️ down right arrow
↙️ down left arrow
↖️ up left arrow
↕️ up down arrow
↔️ left right arrow
↩️ right arrow curving left
↪️ left arrow curving right
⤴️ right arrow curving up
⤵️ right arrow curving down
🔀 shuffle tracks button
🔁 repeat button
🔂 repeat single button
🔄 counterclockwise arrows button
🔃 clockwise vertical arrows
🎵 musical note
🎶 musical notes
➕ plus
➖ minus
➗ divide
✖️ multiply
🟰 heavy equals sign
♾️ infinity
💲 heavy dollar sign
💱 currency exchange
™️ trade mark
©️ copyright
®️ registered
👁️‍🗨️ eye in speech bubble
🔚 end arrow
🔙 back arrow
🔛 on arrow
🔝 top arrow
🔜 soon arrow
✔️ check mark
☑️ check box with check
🔘 radio button
🔴 red circle
🟠 orange circle
🟡 yellow circle
🟢 green circle
🔵 blue circle
🟣 purple circle
⚫ black circle
⚪ white circle
🟥 red square
🟧 orange square
🟨 yellow square
🟩 green square
🟦 blue square
🟪 purple square
⬛ black large square
⬜ white large square
◼️ black medium square
◻️ white medium square
◾ black medium small square
◽ white medium small square
▪️ black small square
▫️ white small square
🔶 large orange diamond
🔷 large blue diamond
🔸 small orange diamond
🔹 small blue diamond
🔺 red triangle pointed up
🔻 red triangle pointed down
💠 diamond with a dot
🔘 radio button
🔳 white square button
🔲 black square button
`);

const flagRows = `
AC Ascension Island
AD Andorra
AE United Arab Emirates
AF Afghanistan
AG Antigua and Barbuda
AI Anguilla
AL Albania
AM Armenia
AO Angola
AR Argentina
AT Austria
AU Australia
AW Aruba
AX Aland Islands
AZ Azerbaijan
BA Bosnia and Herzegovina
BB Barbados
BD Bangladesh
BE Belgium
BF Burkina Faso
BG Bulgaria
BH Bahrain
BI Burundi
BJ Benin
BL St Barthelemy
BM Bermuda
BN Brunei
BO Bolivia
BQ Caribbean Netherlands
BR Brazil
BS Bahamas
BT Bhutan
BW Botswana
BY Belarus
BZ Belize
CA Canada
CC Cocos Islands
CD Congo Kinshasa
CF Central African Republic
CG Congo Brazzaville
CH Switzerland
CI Cote dIvoire
CK Cook Islands
CL Chile
CM Cameroon
CN China
CO Colombia
CR Costa Rica
CU Cuba
CV Cape Verde
CW Curacao
CX Christmas Island
CY Cyprus
CZ Czechia
DE Germany
DJ Djibouti
DK Denmark
DM Dominica
DO Dominican Republic
DZ Algeria
EC Ecuador
EE Estonia
EG Egypt
EH Western Sahara
ER Eritrea
ES Spain
ET Ethiopia
FI Finland
FJ Fiji
FK Falkland Islands
FM Micronesia
FO Faroe Islands
FR France
GA Gabon
GB United Kingdom
GD Grenada
GE Georgia
GF French Guiana
GG Guernsey
GH Ghana
GI Gibraltar
GL Greenland
GM Gambia
GN Guinea
GP Guadeloupe
GQ Equatorial Guinea
GR Greece
GT Guatemala
GU Guam
GW Guinea Bissau
GY Guyana
HK Hong Kong
HN Honduras
HR Croatia
HT Haiti
HU Hungary
ID Indonesia
IE Ireland
IL Israel
IM Isle of Man
IN India
IO British Indian Ocean Territory
IQ Iraq
IR Iran
IS Iceland
IT Italy
JE Jersey
JM Jamaica
JO Jordan
JP Japan
KE Kenya
KG Kyrgyzstan
KH Cambodia
KI Kiribati
KM Comoros
KN St Kitts and Nevis
KP North Korea
KR South Korea
KW Kuwait
KY Cayman Islands
KZ Kazakhstan
LA Laos
LB Lebanon
LC St Lucia
LI Liechtenstein
LK Sri Lanka
LR Liberia
LS Lesotho
LT Lithuania
LU Luxembourg
LV Latvia
LY Libya
MA Morocco
MC Monaco
MD Moldova
ME Montenegro
MF St Martin
MG Madagascar
MH Marshall Islands
MK North Macedonia
ML Mali
MM Myanmar
MN Mongolia
MO Macao
MQ Martinique
MR Mauritania
MS Montserrat
MT Malta
MU Mauritius
MV Maldives
MW Malawi
MX Mexico
MY Malaysia
MZ Mozambique
NA Namibia
NC New Caledonia
NE Niger
NF Norfolk Island
NG Nigeria
NI Nicaragua
NL Netherlands
NO Norway
NP Nepal
NR Nauru
NU Niue
NZ New Zealand
OM Oman
PA Panama
PE Peru
PF French Polynesia
PG Papua New Guinea
PH Philippines
PK Pakistan
PL Poland
PM St Pierre and Miquelon
PN Pitcairn Islands
PR Puerto Rico
PS Palestine
PT Portugal
PW Palau
PY Paraguay
QA Qatar
RE Reunion
RO Romania
RS Serbia
RU Russia
RW Rwanda
SA Saudi Arabia
SB Solomon Islands
SC Seychelles
SD Sudan
SE Sweden
SG Singapore
SH St Helena
SI Slovenia
SJ Svalbard and Jan Mayen
SK Slovakia
SL Sierra Leone
SM San Marino
SN Senegal
SO Somalia
SR Suriname
SS South Sudan
ST Sao Tome and Principe
SV El Salvador
SX Sint Maarten
SY Syria
SZ Eswatini
TA Tristan da Cunha
TC Turks and Caicos Islands
TD Chad
TF French Southern Territories
TG Togo
TH Thailand
TJ Tajikistan
TK Tokelau
TL Timor Leste
TM Turkmenistan
TN Tunisia
TO Tonga
TR Turkey
TT Trinidad and Tobago
TV Tuvalu
TW Taiwan
TZ Tanzania
UA Ukraine
UG Uganda
UM US Outlying Islands
US United States
UY Uruguay
UZ Uzbekistan
VA Vatican City
VC St Vincent and Grenadines
VE Venezuela
VG British Virgin Islands
VI US Virgin Islands
VN Vietnam
VU Vanuatu
WF Wallis and Futuna
WS Samoa
XK Kosovo
YE Yemen
YT Mayotte
ZA South Africa
ZM Zambia
ZW Zimbabwe
GB-ENG England
GB-SCT Scotland
GB-WLS Wales
`.trim().split("\n");

function flagEmoji(code: string) {
  return [...code].map((letter) => String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65)).join("");
}

const flags: EmojiItem[] = [
  { emoji: "🏁", name: "chequered flag", tone: false },
  { emoji: "🚩", name: "triangular flag", tone: false },
  { emoji: "🎌", name: "crossed flags", tone: false },
  { emoji: "🏴", name: "black flag", tone: false },
  { emoji: "🏳️", name: "white flag", tone: false },
  { emoji: "🏳️‍🌈", name: "rainbow flag", tone: false },
  { emoji: "🏳️‍⚧️", name: "transgender flag", tone: false },
  { emoji: "🏴‍☠️", name: "pirate flag", tone: false },
  ...flagRows.flatMap((row) => {
    const space = row.indexOf(" ");
    const code = row.slice(0, space);
    const name = row.slice(space + 1);
    if (code.includes("-")) return [];
    return [{ emoji: flagEmoji(code), name: `${name} ${code}`, tone: false }];
  }),
];

export const emojiGroups: EmojiGroup[] = [
  { id: "smileys", label: "Smileys & people", icon: "😀", items: [...smileys, ...people] },
  { id: "animals", label: "Animals & nature", icon: "🐻", items: animals },
  { id: "food", label: "Food & drink", icon: "🍔", items: food },
  { id: "activity", label: "Activities", icon: "⚽", items: activity },
  { id: "travel", label: "Travel & places", icon: "✈️", items: travel },
  { id: "objects", label: "Objects", icon: "💡", items: objects },
  { id: "symbols", label: "Symbols", icon: "💕", items: symbols },
  { id: "flags", label: "Flags", icon: "🏁", items: flags },
];

export const skinTones = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

export function withTone(item: EmojiItem, tone: string) {
  if (!item.tone || !tone) return item.emoji;
  return item.emoji + tone;
}
