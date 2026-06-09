import logo from "./assets/logo.png";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import {
    BookOpen,
    CheckCircle,
    Edit2,
    Save,
    X,
    Plus,
    Lock,
    Unlock,
} from "lucide-react";

interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string;
                email: string;
                amount: number;
                currency: string;
                reference: string;
                onClose: () => void;
                callback: (response: PaystackResponse) => void;
            }) => { openIframe: () => void };
        };
    }
}

type BibleVersions = {
    KJV: string;
    NKJV: string;
    NIV: string;
    ESV: string;
    AMP: string;
    NLT: string;
};

type ScriptureDB = Record<string, BibleVersions>;

const initialScriptureDB: ScriptureDB = {
  "Genesis 1:1": {
    "KJV": "In the beginning God created the heaven and the earth.",
    "NKJV": "In the beginning God created the heavens and the earth.",
    "NIV": "In the beginning God created the heavens and the earth.",
    "ESV": "In the beginning, God created the heavens and the earth.",
    "AMP": "In the beginning God (Elohim) created the heavens and the earth.",
    "NLT": "In the beginning God created the heavens and the earth.",
  },
  "James 1:17": {
    "KJV": "Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning.",
    "NKJV": "Every good gift and every perfect gift is from above, and comes down from the Father of lights, with whom there is no variation or shadow of turning.",
    "NIV": "Every good and perfect gift is from above, coming down from the Father of the heavenly lights, who does not change like shifting shadows.",
    "ESV": "Every good gift and every perfect gift is from above, coming down from the Father of lights, with whom there is no variation or shadow due to change.",
    "AMP": "Every good thing given and every perfect gift is from above, coming down from the Father of lights, with whom there is no variation or shifting shadow.",
    "NLT": "Whatever is good and perfect is a gift coming down to us from God our Father, who created all the lights in the heavens. He never changes or casts a shifting shadow.",
  },
  "Psalm 132:15": {
        "KJV": "I will abundantly bless her provision: I will satisfy her poor with bread.",
        "NKJV": "I will abundantly bless her provision; I will satisfy her poor with bread.",
        "NIV": "I will bless her with abundant provisions; her poor I will satisfy with food.",
        "ESV": "I will abundantly bless her provisions; I will satisfy her poor with bread.",
        "AMP": "I will abundantly bless her provisions; I will satisfy her poor with bread.",
        "NLT": "I will bless this city and make it prosperous; I will satisfy its poor with food."
  },
  "John 8:32": {
    "KJV": "And ye shall know the truth, and the truth shall make you free.",
    "NKJV": "And you shall know the truth, and the truth shall make you free.",
    "NIV": "Then you will know the truth, and the truth will set you free.",
    "ESV": "and you will know the truth, and the truth will set you free.",
    "AMP": "And you will know the truth [regarding Salvation], and the truth will set you free [from the penalty of sin].",
    "NLT": "And you will know the truth, and the truth will set you free.",
  },
  "Matthew 15:29-37": {
    "KJV": "29 And Jesus departed from thence, and came nigh unto the sea of Galilee; and went up into a mountain, and sat down there. 30 And great multitudes came unto him, having with them those that were lame, blind, dumb, maimed, and many others, and cast them down at Jesus' feet; and he healed them: 31 Insomuch that the multitude wondered, when they saw the dumb to speak, the maimed to be whole, the lame to walk, and the blind to see: and they glorified the God of Israel. 32 Then Jesus called his disciples unto him, and said, I have compassion on the multitude, because they continue with me now three days, and have nothing to eat: and I will not send them away fasting, lest they faint in the way. 33 And his disciples say unto him, Whence should we have so much bread in the wilderness, as to fill so great a multitude? 34 And Jesus saith unto them, How many loaves have ye? And they said, Seven, and a few little fishes. 35 And he commanded the multitude to sit down on the ground. 36 And he took the seven loaves and the fishes, and gave thanks, and brake them, and gave to his disciples, and the disciples to the multitude. 37 And they did all eat, and were filled: and they took up of the broken meat that was left seven baskets full.",
    "NKJV": "29 Jesus departed from there, skirted the Sea of Galilee, and went up on the mountain and sat down there. 30 Then great multitudes came to Him, having with them the lame, blind, mute, maimed, and many others; and they laid them down at Jesus' feet, and He healed them. 31 So the multitude marveled when they saw the mute speaking, the maimed made whole, the lame walking, and the blind seeing; and they glorified the God of Israel. 32 Now Jesus called His disciples to Himself and said, 'I have compassion on the multitude, because they have now continued with Me three days and have nothing to eat. And I do not want to send them away hungry, lest they faint on the way.' 33 Then His disciples said to Him, 'Where could we get enough bread in the wilderness to fill such a great multitude?' 34 Jesus said to them, 'How many loaves do you have?' And they said, 'Seven, and a few little fish.' 35 So He commanded the multitude to sit down on the ground. 36 And He took the seven loaves and the fish and gave thanks, broke them and gave them to His disciples; and the disciples gave to the multitude. 37 So they all ate and were filled, and they took up seven large baskets full of the fragments that were left.",
    "NIV": "29 Jesus left there and went along the Sea of Galilee. Then he went up on a mountainside and sat down. 30 Great crowds came to him, bringing the lame, the blind, the crippled, the mute and many others, and laid them at his feet; and he healed them. 31 The crowd was amazed when they saw the mute speaking, the crippled made well, the lame walking and the blind seeing; and they praised the God of Israel. 32 Jesus called his disciples to him and said, 'I have compassion for these people; they have already been with me three days and have nothing to eat. I do not want to send them away hungry, or they may faint on the way.' 33 His disciples answered, 'Where could we get enough bread in this remote place to feed such a crowd?' 34 'How many loaves do you have?' Jesus asked. 'Seven,' they replied, 'and a few small fish.' 35 He told the crowd to sit down on the ground. 36 Then he took the seven loaves and the fish, and when he had given thanks, he broke them and gave them to the disciples, and they in turn to the people. 37 They all ate and were satisfied. Afterward the disciples picked up seven basketfuls of broken pieces that were left over.",
    "ESV": "29 Jesus went on from there and walked beside the Sea of Galilee. And he went up on the mountain and sat down there. 30 And great crowds came to him, bringing with them the lame, the blind, the crippled, the mute, and many others, and they put them at his feet, and he healed them, 31 so that the crowd wondered, when they saw the mute speaking, the crippled healthy, the lame walking, and the blind seeing. And they glorified the God of Israel. 32 Then Jesus called his disciples to him and said, 'I have compassion on the crowd because they have been with me now three days and have nothing to eat. And I am unwilling to send them away hungry, lest they faint on the way.' 33 And the disciples said to him, 'Where are we to get enough bread in such a desolate place to feed so great a crowd?' 34 And Jesus said to them, 'How many loaves do you have?' They said, 'Seven, and a few small fish.' 35 And directing the crowd to sit down on the ground, 36 he took the seven loaves and the fish, and having given thanks he broke them and gave them to the disciples, and the disciples gave them to the crowds. 37 And they all ate and were satisfied. And they took up seven baskets full of the broken pieces left over.",
    "AMP": "29 Jesus went on from there and walked beside the Sea of Galilee. And He went up on the mountain and sat down there. 30 And great crowds came to Him, bringing with them the lame, the blind, the crippled, the mute, and many others, and they laid them down at His feet; and He healed them. 31 So the crowd was amazed when they saw the mute speaking, the crippled restored, the lame walking, and the blind seeing; and they praised and glorified the God of Israel. 32 Then Jesus called His disciples to Him and said, 'I have compassion on the crowd, because they have been with Me now three days and have nothing to eat; and I am unwilling to send them away hungry, lest they faint [from exhaustion] on the way.' 33 The disciples said to Him, 'Where are we to get enough bread in this isolated place to feed so great a crowd?' 34 Jesus asked them, 'How many loaves [of bread] do you have?' They said, 'Seven, and a few small fish.' 35 And He directed the crowd to sit down on the ground, 36 and He took the seven loaves and the fish; and when He had given thanks, He broke them and gave them to the disciples, and the disciples [gave them] to the crowds. 37 And they all ate and were satisfied. And they picked up seven large baskets full of the broken pieces that were left over.",
    "NLT": "29 Jesus returned to the Sea of Galilee and climbed a hill and sat down. 30 A vast crowd brought to him people who were lame, blind, crippled, those who couldn't speak, and many others. They laid them before Jesus, and he healed them all. 31 The crowd was amazed! Those who hadn't been able to speak were talking, the crippled were made well, the lame were walking, and the blind could see again. And they praised the God of Israel. 32 Then Jesus called his disciples to him and said, 'I feel sorry for these people. They have been here with me for three days, and they have nothing left to eat. I don't want to send them away hungry, or they will faint along the way.' 33 The disciples replied, 'Where would we get enough food here in the wilderness for such a huge crowd?' 34 Jesus asked, 'How much bread do you have?' 'Seven loaves,' they replied, 'and a few small fish.' 35 So Jesus told all the people to sit down on the ground. 36 Then he took the seven loaves and the fish, thanked God for them, and broke them into pieces. He gave them to the disciples, who distributed the food to the crowd. 37 They all ate as much as they wanted. Afterward, the disciples picked up seven large baskets of leftover pieces.",
  },
  "1 Peter 5:7": {
    "KJV": "Casting all your care upon him; for he careth for you.",
    "NKJV": "casting all your care upon Him, for He cares for you.",
    "NIV": "Cast all your anxiety on him because he cares for you.",
    "ESV": "casting all your anxieties on him, because he cares for you.",
    "AMP": "casting all your anxiety [all your worries, all your concerns, once and for all] on Him, for He cares about you [with deepest affection, and watches over you very carefully].",
    "NLT": "Give all your worries and cares to God, for he cares about you."
  },
  "Matthew 15:30": {
    "KJV": "And great multitudes came unto him, having with them those that were lame, blind, dumb, maimed, and many others, and cast them down at Jesus' feet; and he healed them:",
    "NKJV": "Then great multitudes came to Him, having with them the lame, blind, mute, maimed, and many others; and they laid them down at Jesus’ feet, and He healed them.",
    "NIV": "Great crowds came to him, bringing the lame, the blind, the crippled, the mute and many others, and laid them at his feet; and he healed them.",
    "ESV": "And great crowds came to him, bringing with them the lame, the blind, the crippled, the mute, and many others, and they put them at his feet, and he healed them,",
    "AMP": "And great crowds came to Him, bringing with them the lame, the blind, the crippled, the mute, and many others, and they laid them down at His feet; and He healed them.",
    "NLT": "A vast crowd brought to him people who were lame, blind, crippled, those who couldn't speak, and many others. They laid them before Jesus, and he healed them all."
  },
  "Matthew 11:28": {
    "KJV": "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    "NKJV": "Come to Me, all you who labor and are heavy laden, and I will give you rest.",
    "NIV": "Come to me, all you who are weary and burdened, and I will give you rest.",
    "ESV": "Come to me, all who labor and are heavy laden, and I will give you rest.",
    "AMP": "Come to Me, all who are weary and heavily burdened [by religious rituals that provide no peace], and I will give you rest [refreshing your souls with salvation].",
    "NLT": "Then Jesus said, \"Come to me, all of you who are weary and carry heavy burdens, and I will give you rest.\""
  },
  "Matthew 15:30-31": {
    "KJV": "30 And great multitudes came unto him, having with them those that were lame, blind, dumb, maimed, and many others, and cast them down at Jesus' feet; and he healed them: 31 Insomuch that the multitude wondered, when they saw the dumb to speak, the maimed to be whole, the lame to walk, and the blind to see: and they glorified the God of Israel.",
    "NKJV": "30 Then great multitudes came to Him, having with them the lame, blind, mute, maimed, and many others; and they laid them down at Jesus’ feet, and He healed them. 31 So the multitude marveled when they saw the mute speaking, the maimed made whole, the lame walking, and the blind seeing; and they glorified the God of Israel.",
    "NIV": "30 Great crowds came to him, bringing the lame, the blind, the crippled, the mute and many others, and laid them at his feet; and he healed them. 31 The crowd was amazed when they saw the mute speaking, the crippled made well, the lame walking and the blind seeing; and they praised the God of Israel.",
    "ESV": "30 And great crowds came to him, bringing with them the lame, the blind, the crippled, the mute, and many others, and they put them at his feet, and he healed them, 31 so that the crowd wondered, when they saw the mute speaking, the crippled healthy, the lame walking, and the blind seeing. And they glorified the God of Israel.",
    "AMP": "30 And great crowds came to Him, bringing with them the lame, the blind, the crippled, the mute, and many others, and they laid them down at His feet; and He healed them. 31 So the crowd was amazed when they saw the mute speaking, the crippled restored, the lame walking, and the blind seeing; and they praised and glorified the God of Israel.",
    "NLT": "30 A vast crowd brought to him people who were lame, blind, crippled, those who couldn't speak, and many others. They laid them before Jesus, and he healed them all. 31 The crowd was amazed! Those who hadn't been able to speak were talking, the crippled were made well, the lame were walking, and the blind could see again. And they praised the God of Israel."
  },
  "Matthew 15:31-32": {
    "KJV": "31 Insomuch that the multitude wondered, when they saw the dumb to speak, the maimed to be whole, the lame to walk, and the blind to see: and they glorified the God of Israel. 32 Then Jesus called his disciples unto him, and said, I have compassion on the multitude, because they continue with me now three days, and have nothing to eat: and I will not send them away fasting, lest they faint in the way.",
    "NKJV": "31 So the multitude marveled when they saw the mute speaking, the maimed made whole, the lame walking, and the blind seeing; and they glorified the God of Israel. 32 Now Jesus called His disciples to Himself and said, “I have compassion on the multitude, because they have now continued with Me three days and have nothing to eat. And I do not want to send them away hungry, lest they faint on the way.”",
    "NIV": "31 The crowd was amazed when they saw the mute speaking, the crippled made well, the lame walking and the blind seeing; and they praised the God of Israel. 32 Jesus called his disciples to him and said, “/I have compassion for these people; they have already been with me three days and have nothing to eat. I do not want to send them away hungry, or they may faint on the way.”",  
    "ESV": "31 so that the crowd wondered, when they saw the mute speaking, the crippled healthy, the lame walking, and the blind seeing. And they glorified the God of Israel. 32 Then Jesus called his disciples to him and said, “I have compassion on the crowd because they have been with me now three days and have nothing to eat. And I am unwilling to send them away hungry, lest they faint on the way.”",
    "AMP": "31 So the crowd was amazed when they saw the mute speaking, the crippled restored, the lame walking, and the blind seeing; and they praised and glorified the God of Israel. 32 Then Jesus called His disciples to Him and said, “I have compassion on the crowd, because they have been with Me now three days and have nothing to eat; and I am unwilling to send them away hungry, lest they faint [from exhaustion] on the way.”",
    "NLT": "31 The crowd was amazed! Those who hadn't been able to speak were talking, the crippled were made well, the lame were walking, and the blind could see again. And they praised the God of Israel. 32 Then Jesus called his disciples to him and said, “I feel sorry for these people. They have been here with me for three days, and they have nothing left to eat. I don't want to send them away hungry, or they will faint along the way.”",
  },
  "James 1:6-8": {
    "KJV": "6 But let him ask in faith, nothing wavering. For he that wavering is like a wave of the sea driven with the wind and tossed. 7 For let not that man think that he shall receive any thing of the Lord. 8 A double minded man is unstable in all his ways.",
    "NKJV": "6 But let him ask in faith, with no doubting, for he who doubts is like a wave of the sea driven and tossed by the wind. 7 For let not that man suppose that he will receive anything from the Lord; 8 he is a double-minded man, unstable in all his ways.",
    "NIV": "6 But when you ask, you must believe and not doubt, because the one who doubts is like a wave of the sea, blown and tossed by the wind. 7 That person should not expect to receive anything from the Lord. 8 Such a person is double-minded and unstable in all they do.",
    "ESV": "6 But let him ask in faith, with no doubting, for the one who doubts is like a wave of the sea that is driven and tossed by the wind. 7 For that person must not suppose that he will receive anything from the Lord; 8 he is a double-minded man, unstable in all his ways.",
    "AMP": "6 But he must ask [for wisdom] in faith, without doubting [God’s willingness to help], for the one who doubts is like a surging wave of the sea, blown and tossed by the wind. 7 For that person must not expect that he will receive anything [at all] from the Lord, 8 being a double-minded man, unstable and restless in all his ways [in everything he thinks, feels, or does].",
    "NLT": "6 But when you ask him, be sure that your faith is in God alone. Do not doubt, for a person with divided loyalty is as unsettled as a wave of the sea that is blown and tossed by the wind. 7 Such people should not expect to receive anything from the Lord. 8 Their loyalty is divided between God and the world, and they are unstable in everything they do."
  },
  "Psalm 100:4": {
    "KJV": "Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.",
    "NKJV": "Enter into His gates with thanksgiving, And into His courts with praise. Be thankful to Him, and bless His name.",
    "NIV": "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.",
    "ESV": "Enter his gates with thanksgiving, and his courts with praise! Give thanks to him; bless his name!",
    "AMP": "Enter His gates with a song of thanksgiving And His courts with praise. Be thankful to Him, bless and praise His name.",
    "NLT": "Enter his gates with thanksgiving; go into his courts with praise. Give thanks to him and praise his name."
  },
  "Psalm 22:3": {
    "KJV": "But thou art holy, O thou that inhabitest the praises of Israel.",
    "NKJV": "But You are holy, Enthroned in the praises of Israel.",
    "NIV": "Yet you are enthroned as the Holy One; you are the one Israel praises.",
    "ESV": "Yet you are holy, enthroned on the praises of Israel.",
    "AMP": "Yet You are holy, O You who are enthroned upon the praises of Israel.",
    "NLT": "Yet you are holy, enthroned on the praises of Israel."
  },
  "Psalm 16:11": {
    "KJV": "Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.",
    "NKJV": "You will show me the path of life; In Your presence is fullness of joy; At Your right hand are pleasures forevermore.",
    "NIV": "You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.",
    "ESV": "You make known to me the path of life; in your presence there is fullness of joy; at your right hand are pleasures forevermore.",
    "AMP": "You will make known to me the path of life; In Your presence is fullness of joy; In Your right hand there are pleasures forevermore.",
    "NLT": "You will show me the way of life, granting me the joy of your presence and the pleasures of living with you forever."
  },
  "Matthew 15:34-36": {
    "KJV": "34 And Jesus saith unto them, How many loaves have ye? And they said, Seven, and a few little fishes. 35 And he commanded the multitude to sit down on the ground. 36 And he took the seven loaves and the fishes, and gave thanks, and brake them, and gave to his disciples, and the disciples to the multitude.",
    "NKJV": "34 Jesus said to them, 'How many loaves do you have?' They said, 'Seven, and a few small fish.' 35 So He commanded the multitude to sit down on the ground. 36 And He took the seven loaves and the fish and gave thanks, broke them and gave them to His disciples; and the disciples gave them to the multitude.",
    "NIV": "34 'How many loaves do you have?' Jesus asked. 'Seven,' they replied, 'and a few small fish.' 35 He told the crowd to sit down on the ground. 36 Then he took the seven loaves and the fish, and when he had given thanks, he broke them and gave them to the disciples, and they in turn to the people.",
    "ESV": "34 And Jesus said to them, 'How many loaves do you have?' They said, 'Seven, and a few small fish.' 35 And directing the crowd to sit down on the ground, 36 he took the seven loaves and the fish, and having given thanks he broke them and gave them to the disciples, and the disciples gave them to the crowds.",
    "AMP": "34 Jesus asked them, 'How many loaves [of bread] do you have?' They said, 'Seven, and a few small fish.' 35 And He directed the crowd to sit down on the ground, 36 and He took the seven loaves and the fish; and when He had given thanks, He broke them and gave them to the disciples, and the disciples [gave them] to the crowds.",
    "NLT": "34 Jesus asked, 'How much bread do you have?' 'Seven loaves,' they replied, 'and a few small fish.' 35 So Jesus told all the people to sit down on the ground. 36 Then he took the seven loaves and the fish, thanked God for them, and broke them into pieces. He gave them to the disciples, who distributed the food to the crowd."
  },
  "Luke 6:38": {
    "KJV": "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over, shall men give into your bosom. For with the same measure that ye mete withal it shall be measured to you again.",
    "NKJV": "Give, and it will be given to you: good measure, pressed down, shaken together, and running over will be put into your bosom. For with the same measure that you use, it will be measured back to you.",
    "NIV": "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap. For with the measure you use, it will be measured to you.",
    "ESV": "give, and it will be given to you. Good measure, pressed down, shaken together, running over, will be put into your lap. For with the measure you use it will be measured back to you.",
    "AMP": "Give, and it will be given to you. A good measure, pressed down, shaken together, running over, will they pour into the lap of your robe. For by your standard of measure [that is, the measure you use when you confer benefits on others] it will be measured to you in return.",
    "NLT": "Give, and you will receive. Your gift will return to you in full—pressed down, shaken together to make room for more, running over, and poured into your lap. The amount you give will determine the amount you get back."
  },
  "2 Corinthians 9:6-8": {
    "KJV": "6 But this I say, He which soweth sparingly shall reap also sparingly; and he which soweth bountifully shall reap also bountifully. 7 Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver. 8 And God is able to make all grace abound toward you; that ye, always having all sufficiency in all things, may abound to every good work:",
    "NKJV": "6 But this I say: He who sows sparingly will also reap sparingly, and he who sows bountifully will also reap bountifully. 7 So let each one give as he purposes in his heart, not grudgingly or of necessity; for God loves a cheerful giver. 8 And God is able to make all grace abound toward you, that you, always having all sufficiency in all things, may have an abundance for every good work.",
    "NIV": "6 Remember this: Whoever sows sparingly will also reap sparingly, and whoever sows bountifully will also reap bountifully. 7 Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver. 8 And God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work.",
    "ESV": "6 The point is this: whoever sows sparingly will also reap sparingly, and whoever sows bountifully will also reap bountifully. 7 Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver. 8 And God is able to make all grace abound to you, so that having all sufficiency in all things at all times, you may abound in every good work.",
    "AMP": "6 Now [remember] this: he who sows sparingly will also reap sparingly, and he who sows generously will also reap generously. 7 Let each one give [thoughtfully and with purpose] just as he has decided in his heart, not grudgingly or under compulsion, for God loves a cheerful giver [and delights in the one whose heart is in his gift]. 8 And God is able to make all grace [every favor and earthly blessing] come in abundance to you, so that you may always [under all circumstances, regardless of the need] have complete sufficiency in everything [being completely self-sufficient in Him], and have an abundance for every good work and act of charity.",
    "NLT": "6 Remember this—a farmer who plants only a few seeds will get a small crop. But the one who plants generously will get a generous crop. 7 You must each decide in your heart how much to give. And don’t give reluctantly or in response to pressure. “For God loves a person who gives cheerfully.” 8 And God will generously provide all you need. Then you will always have everything you need and plenty left over to share with others."
  },
  "Deuteronomy 8:18": {
    "KJV": "But thou shalt remember the LORD thy God: for it is he that giveth thee power to get wealth, that he may establish his covenant which he sware unto thy fathers, as it is this day.",
    "NKJV": "And you shall remember the LORD your God, for it is He who gives you power to get wealth, that He may establish His covenant which He swore to your fathers, as it is this day.",
    "NIV": "But remember the LORD your God, for it is he who gives you the ability to produce wealth, and so confirms his covenant, which he swore to your ancestors, as it is today.",
    "ESV": "You shall remember the LORD your God, for it is he who gives you power to get wealth, that he may confirm his covenant that he swore to your fathers, as it is this day.",
    "AMP": "But you shall remember [with profound respect] the LORD your God, for it is He who is giving you power to make wealth, that He may confirm His covenant which He swore to your fathers, as it is this day.",
    "NLT": "Remember the LORD your God. He is the one who gives you power to be successful, in order to fulfill the covenant he confirmed to your ancestors with an oath, as he did today."
  },
  "Matthew 15:35": {
    "KJV": "And he commanded the multitude to sit down on the ground.",
    "NKJV": "So He commanded the multitude to sit down on the ground.",
    "NIV": "He told the crowd to sit down on the ground.",
    "ESV": "And directing the crowd to sit down on the ground,",
    "AMP": "And He directed the crowd to sit down on the ground,",
    "NLT": "So Jesus told all the people to sit down on the ground."
  },
  "Joshua 1:7-8": {
    "KJV": "7 Only be thou strong and very courageous, that thou mayest observe to do according to all the law, which Moses my servant commanded thee: turn not from it to the right hand or to the left, that thou mayest prosper whithersoever thou goest. 8 This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night, that thou mayest observe to do according to all that is written therein: for then thou shalt make thy way prosperous, and then thou shalt have good success.",
    "NKJV": "7 Only be strong and very courageous, that you may observe to do according to all the law which Moses My servant commanded you; do not turn from it to the right hand or to the left, that you may prosper wherever you go. 8 This Book of the Law shall not depart from your mouth, but you shall meditate in it day and night, that you may observe to do according to all that is written in it. For then you will make your way prosperous, and then you will have good success.",
    "NIV": "7 'Be strong and very courageous. Be careful to obey all the law my servant Moses gave you; do not turn from it to the right or to the left, that you may be successful wherever you go. 8 Keep this Book of the Law always on your lips; meditate on it day and night, so that you may be careful to do everything written in it. Then you will be prosperous and successful.'",
    "ESV": "7 Only be strong and very courageous, being careful to do according to all the law that Moses my servant commanded you. Do not turn from it to the right hand or to the left, that you may have good success wherever you go. 8 This Book of the Law shall not depart from your mouth, but you shall meditate on it day and night, so that you may be careful to do according to all that is written in it. For then you will make your way prosperous, and then you will have good success.",
    "AMP": "7 Only be strong and very courageous; be careful to do [everything] in accordance with the entire law which Moses My servant commanded you; do not turn from it to the right or to the left, so that you may prosper and be successful wherever you go. 8 This Book of the Law shall not depart from your mouth, but you shall read [and meditate on] it day and night, so that you may be careful to do [everything] in accordance with all that is written in it; for then you will make your way prosperous, and then you will be successful.",
    "NLT": "7 Be strong and very courageous. Be careful to obey all the instructions Moses gave you. Do not deviate from them, turning either to the right or to the left. Then you will be successful in everything you do. 8 Study this Book of Instruction continually. Meditate on it day and night so you will be sure to obey everything written in it. Only then will you prosper and succeed in all you do."
  },
  "Hebrews 13:8": {
    "KJV": "Jesus Christ the same yesterday, and to day, and for ever.",
    "NKJV": "Jesus Christ is the same yesterday, today, and forever.",
    "NIV": "Jesus Christ is the same yesterday and today and forever.",
    "ESV": "Jesus Christ is the same yesterday and today and forever.",
    "AMP": "Jesus Christ is the same [yesterday, today, and forever].",
    "NLT": "Jesus Christ is the same yesterday, today, and forever."
  },

};





const SundaySchoolApp = () => {
    const [showPaymentGate, setShowPaymentGate] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [activeTab, setActiveTab] = useState("intro");
    const [darkMode, setDarkMode] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [loading, setLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [scriptureDB, setScriptureDB] =
        useState<ScriptureDB>(initialScriptureDB);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [bibleVersion, setBibleVersion] =
        useState<keyof BibleVersions>("KJV");
    const [showVerseModal, setShowVerseModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newVerse, setNewVerse] = useState<{
        reference: string;
        versions: BibleVersions;
    }>({
        reference: "",
        versions: { KJV: "", NKJV: "", NIV: "", ESV: "", AMP: "", NLT: "" },
    });
    const [verseLoading, setVerseLoading] = useState(false);
    
    const [editingContent, setEditingContent] = useState<string | null>(null);

    type SubPoint = { title: string; content: string; scripture?: string };
    type LessonPoint = {
        title: string;
        content: string;
        scriptures: string[];
        subPoints: SubPoint[];
    };
    type ContentData = {
        lessonDate: string;
        lessonTitle: string;
        memoryVerse: string;
        memoryVerseRef: string;
        introduction: string;
        introScriptures: string[];
        lessonIntroScriptures: string[];
        aims: string;
        objectives: string;
        lessonIntro: string;
        lessonPoints: LessonPoint[];
        conclusion: string;
        conclusionScriptures: string[];
        prayerPoints: string[];
    };
    

const [contentData, setContentData] = useState<ContentData>({
    lessonDate: "June 14, 2026",
    lessonTitle: "PRINCIPLES OF DIVINE PROVISION",

    memoryVerse:
        "I will abundantly bless her provision; I will satisfy her poor with bread. - Ps. 132:15",
    memoryVerseRef: "Psalm 132:15",

    introScriptures: ["Genesis 1:1", "James 1:17", "John 8:32"],
    lessonIntroScriptures: ["Matthew 15:29-37"],

    introduction:
        "God is known to be the creator of all things and the One from whom every good and perfect gift comes. Gen 1:1; James 1:17. Owing to these facts, many people have sought him for provisions without having their desires met. The ultimate reason is because they neither understood the principles bordering around provisions nor walked in it. Man is a product of what he knows. John 8:32.",

    aims:
        "To tailor the believer to the knowledge of how to receive God's provisions.",

    objectives:
        "To get the believer to the place of endowment with the rich provisions of God.",

    lessonIntro:
        "Jesus returned to Galilee to better the lot of His people and many took advantage of it and came to Him. They also came with their burdens which were lifted from them and had supernatural provision of food. This entire scene is a revelation of the relationship between man and God with principles that activates Divine provisions. Let us deduce the principles provided from the picture that is presented in the passage.",

    lessonPoints: [
        {
            title: "KNOWLEDGE OF GOD'S CARE:",
            content:
                "The first principle of divine provision is to realize that God cares for you and what you're going through. 1 Pet 5:7. These people came to Jesus with their heavy burdens because they knew that He will help them or else they would have come alone because of uncertainty. Verse 30",
            scriptures: ["1 Peter 5:7", "Matthew 15:30"],
            subPoints: [],
        },
        {
            title: "RECIPIENTS HAVE TO COME TO JESUS:",
            content:
                "If you want to receive divine provisions then you have to come to Jesus. Matt 11:28. Don't say He knows what I'm going through so let him help if he's willing. These people had the need and thus came to him without waiting for others to stand in for them. Verse 30.",
            scriptures: ["Matthew 11:28", "Matthew 15:30"],
            subPoints: [],
        },
        {
            title: "CASTING NEEDS AT JESUS' FEET:",
            content:
                "This is the only way to receive his attention and help. He took care of every case that was laid at his feet. Verse 30-31, 1 Pet 5:7. Be sure that Jesus is in the place where you're taking your burdens to and also that you're not leaving them at the feet of church.",
            scriptures: ["Matthew 15:30-31", "1 Peter 5:7"],
            subPoints: [],
        },
        {
            title: "TARRY WITH JESUS:",
            content:
                "One of the principles is to remain with Jesus wherever He is as these people did. They did not leave after one miracle service but stayed beyond. Verse 31 - 32. Most people who seek God today can't receive provisions because they are so unstable bodily and in heart. James 1:6-8.",
            scriptures: ["Matthew 15:31-32", "James 1:6-8"],
            subPoints: [],
        },
        {
            title: "PRAISING THE GOD OF ISRAEL:",
            content:
                "Thanksgiving brings man to the entrance of Heaven but Praises ushers him to the very throne of God. Ps 100:4. They praised the God of Israel but which one are you praising. Be sure that you're praising God and that the praises are to the true God because he inhabits it (Ps 22:3) and in his presence there is fullness of joy. Ps 16:11.",
            scriptures: ["Psalm 100:4", "Psalm 22:3", "Psalm 16:11"],
            subPoints: [],
        },
        {
            title: "GIVING TO THE RIGHT SOURCE:",
            content:
                "Sowing remains the only way of determining harvest but prayer only creates an atmosphere for sowing and reminding God to facilitate the harvest. The people gave their substance and received abundantly to overflowing. Verse 34 - 36; Luke 6:38; 2 Cor 9:6-8; Deut 8:18.",
            scriptures: ["Matthew 15:34-36", "Luke 6:38", "2 Corinthians 9:6-8", "Deuteronomy 8:18"],
            subPoints: [],
        },
        {
            title: "OBEYING THE COMMANDMENTS OF GOD:",
            content:
                "Jesus asked them to sit down and they obeyed. Verse 35. This is not applicable to many of us as we daily violate his commandments. See Joshua 1:7-8.",
            scriptures: ["Matthew 15:35", "Joshua 1:7-8"],
            subPoints: [],
        },
    ],

    conclusion:
        "The principles are still the same today and if applied will give unequal divine provisions. Heb 13:8.",

    conclusionScriptures: ["Hebrews 13:8"],

    prayerPoints: [
        "Father, clear away all uncertainty and grant me a deep revelation and knowledge of Your personal care for my life.",
        "Lord, give me the spiritual stability to tarry in Your presence without wavering, even when answers take time.",
        "Father, give me an obedient heart to completely follow Your instructions so I can walk in the fullness of Your divine provision.",
    ],
});







    const formatScriptureText = (text: string) => {
        const parts = text.split(/(\d+)/);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return (
                    <strong key={index} className="font-bold">
                        {part}
                    </strong>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setAppLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);
    const adjustFontSize = (delta: number) =>
        setFontSize((prev) => Math.min(Math.max(prev + delta, 12), 24));
    const handleTabChange = (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoading(false);
        }, 500);
    };

    const showBibleVersions = (reference: string) => {
        setSelectedVerse(reference);
        setShowVerseModal(true);
        setVerseLoading(true);
        setTimeout(() => setVerseLoading(false), 800);
    };

    const changeBibleVersion = (version: keyof BibleVersions) => {
        setVerseLoading(true);
        setTimeout(() => {
            setBibleVersion(version);
            setVerseLoading(false);
        }, 600);
    };

    const addNewScripture = () => {
        if (
            newVerse.reference &&
            Object.values(newVerse.versions).some((v) => v !== "")
        ) {
            setScriptureDB((prev) => ({
                ...prev,
                [newVerse.reference]: newVerse.versions,
            }));
            setNewVerse({
                reference: "",
                versions: {
                    KJV: "",
                    NKJV: "",
                    NIV: "",
                    ESV: "",
                    AMP: "",
                    NLT: "",
                },
            });
            setEditMode(false);
        }
    };

    const updateVerseVersion = (version: keyof BibleVersions, text: string) => {
        setNewVerse((prev) => ({
            ...prev,
            versions: { ...prev.versions, [version]: text },
        }));
    };

    

   

   

   

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "M") {
                e.preventDefault();
                handleTabChange("manage");
            }
            if (e.ctrlKey && e.shiftKey && e.key === "E") {
                e.preventDefault();
                setEditingContent(editingContent ? null : activeTab);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [editingContent, activeTab]);

    const updateContent = (field: string, value: string) =>
        setContentData((prev) => ({ ...prev, [field]: value }));
    const updateLessonPoint = (index: number, field: string, value: string) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === index ? { ...point, [field]: value } : point
            ),
        }));
    };
    const updatePrayerPoint = (index: number, value: string) => {
        setContentData((prev) => ({
            ...prev,
            prayerPoints: prev.prayerPoints.map((prayer, i) =>
                i === index ? value : prayer
            ),
        }));
    };
    const updateLessonSubPoint = (
        pointIndex: number,
        subIndex: number,
        field: string,
        value: string
    ) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.map((sub, j) =>
                              j === subIndex ? { ...sub, [field]: value } : sub
                          ),
                      }
                    : point
            ),
        }));
    };
    const addLessonSubPoint = (pointIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: [
                              ...point.subPoints,
                              {
                                  title: "New Point",
                                  content: "",
                                  scripture: "",
                              },
                          ],
                      }
                    : point
            ),
        }));
    };
    const deleteLessonSubPoint = (pointIndex: number, subIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.filter(
                              (_, j) => j !== subIndex
                          ),
                      }
                    : point
            ),
        }));
    };
    const addPrayerPoint = () =>
        setContentData((prev) => ({
            ...prev,
            prayerPoints: [...prev.prayerPoints, "New prayer point..."],
        }));

    const PAYSTACK_PUBLIC_KEY =
        "pk_test_bed97038ebcf74b30219ed0500cfffc6e80948f1";
    const PAYMENT_AMOUNT = 500000;

    const handlePaystackSuccess = (reference: unknown) => {
        console.log("Payment successful:", reference);
        setIsPaid(true);
        setShowPaymentGate(false);
    };

    const handlePaystackClose = () => console.log("Payment closed");

    const initializePaystack = () => {
        if (!window.PaystackPop) {
            alert("Paystack script not loaded!");
            return;
        }
        const paystack = window.PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: "user@example.com",
            amount: PAYMENT_AMOUNT,
            currency: "NGN",
            reference: "SSA_" + Math.floor(Math.random() * 1000000000 + 1),
            onClose: () => handlePaystackClose(),
            callback: (transaction: PaystackResponse) =>
                handlePaystackSuccess(transaction),
        });
        paystack.openIframe();
    };

    const handleFreePlan = () => {
        setShowPaymentGate(false);
        setIsPaid(false);
    };

    const themeClasses = darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white"
        : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-gray-900";


        if (appLoading) {
    const animatedText = "June is my Month of Divine Mercy - Eccl. 33:17-19".split("");

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping"
                            style={{ animationDelay: "0.3s" }}
                        ></div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Life Gate Ministries Worldwide
                </h1>
                <p className="text-xl text-white/90 mb-8">
                    Sunday School Lessons
                </p>

                {/* Single-color glowing neon text */}
                <div className="flex justify-center mb-6 text-3xl md:text-4xl font-extrabold">
                    {animatedText.map((char, idx) => (
                        <span
                            key={idx}
                            className="inline-block text-blue-400 drop-shadow-[0_0_10px_#00ffff] animate-[wave_1.5s_ease-in-out_infinite]"
                            style={{
                                animationDelay: `${idx * 0.1}s`,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </div>

                <div className="text-white/80 mb-6 text-lg animate-pulse">
                    Loading Sunday School Lesson...
                </div>
                <div className="w-64 mx-auto bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>
                <p className="text-white/70 mt-3 text-sm">
                    {loadingProgress}%
                </p>
            </div>

            {/* Keyframes for smooth wave bounce */}
            <style>
                {`
                    @keyframes wave {
                        0%, 100% { transform: translateY(0); }
                        25% { transform: translateY(-12px); }
                        50% { transform: translateY(8px); }
                        75% { transform: translateY(-6px); }
                    }
                `}
            </style>
        </div>
    );
}




    if (showPaymentGate) {
        return (
            <div
                className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 relative overflow-hidden`}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div
                        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>
                <div className="max-w-4xl w-full relative z-10">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Sunday School Lesson
                        </h1>
                        <p className="text-xl opacity-80">
                            PRINCIPLES OF DIVINE PROVISION
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Free Access
                                    </h3>
                                    <Unlock
                                        className="text-green-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦0
                                    </p>
                                    <p className="opacity-70">View Only Mode</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Read all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Take interactive quizzes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No content editing
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No scripture management
                                        </span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleFreePlan}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Continue Free
                                </button>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    BEST VALUE
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Premium Access
                                    </h3>
                                    <Lock
                                        className="text-purple-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦5,000
                                    </p>
                                    <p className="opacity-70">Full Access</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Edit all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Manage Bible scriptures</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Save your commitments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={initializePaystack}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Unlock Premium
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center mt-8 opacity-70 text-sm">
                        Secure payment powered by Paystack • All transactions
                        are encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${themeClasses} transition-all duration-500 relative`}
            style={{ fontSize: `${fontSize}px` }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
                <div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>
            <Header
                logo={logo}
                contentData={contentData}
                fontSize={fontSize}
                adjustFontSize={adjustFontSize}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {contentData.lessonTitle}
                </h2>
                <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap md:flex-wrap justify-start md:justify-center scrollbar-hide backdrop-blur-sm bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[
                        "intro",
                        "lesson",
                        "conclusion",
                        "prayer",
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : darkMode
                                    ? "bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10"
                                    : "bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/10"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    {isPaid && (
                        <button
                            onClick={() => handleTabChange("manage")}
                            className={`px-2 py-3 rounded-xl font-semibold transition-all flex-shrink-0 opacity-0 hover:opacity-10 ${
                                activeTab === "manage"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-white/10 backdrop-blur-md"
                            }`}
                            title="Admin"
                            style={{ width: "40px" }}
                        >
                            <Edit2 size={16} className="mx-auto" />
                        </button>
                    )}
                </div>
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                )}
                {!loading && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                        {activeTab === "intro" && (
                            <div className="space-y-6">
                                {editingContent === "intro" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-blue-900/30"
                                            : "bg-blue-50"
                                    } p-6 rounded-lg border-l-4 border-blue-600`}
                                >
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <BookOpen className="text-blue-600" />{" "}
                                        Memory Verse
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.memoryVerse}
                                            onChange={(e) =>
                                                updateContent(
                                                    "memoryVerse",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border text-xl italic mb-4 ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={2}
                                        />
                                    ) : (
                                        <blockquote className="text-xl italic mb-4">
                                            "{contentData.memoryVerse}"
                                        </blockquote>
                                    )}
                                    <button
                                        onClick={() =>
                                            showBibleVersions(
                                                contentData.memoryVerseRef
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Read {contentData.memoryVerseRef}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Text: Matthew 15:29-37
                                    </h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "Matthew 15:29-37"
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                        <BookOpen size={16} />
                                            Read Matthew 15:29-37
                                        </button>

                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Introduction
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.introduction}
                                            onChange={(e) =>
                                                updateContent(
                                                    "introduction",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={6}
                                        />
                                    ) : (
                                        <p className="leading-relaxed">
                                            {contentData.introduction}
                                            <div className="flex gap-4">
                                                <button
                                                onClick={() =>
                                                    showBibleVersions(
                                                        "Genesis 1:1"
                                                    )
                                                }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                            >
                                            <BookOpen size={16} />
                                                Genesis 1:1
                                            </button>

                                            <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "James 1:17"
                                                )
                                            }
                                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                        >
                                            <BookOpen size={16} />
                                                James 1:17
                                            </button>
                                            <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "John 8:32"
                                                )
                                            }
                                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                        >
                                            <BookOpen size={16} />
                                                John 8:32
                                            </button>
                                            </div>
                                            
                                        </p>
                                        
                                    )}
                                   
                                </div>
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-green-900/30"
                                            : "bg-green-50"
                                    } p-6 rounded-lg`}
                                >
                                    <h3 className="text-xl font-bold mb-3">
                                        Aims and Objectives
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                AIMS:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={contentData.aims}
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "aims",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={3}
                                                />
                                            ) : (
                                                <p>{contentData.aims}</p>
                                            )}
                                        </div>
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                OBJECTIVES:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={
                                                        contentData.objectives
                                                    }
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "objectives",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={2}
                                                />
                                            ) : (
                                                <p>{contentData.objectives}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "lesson" && (
                            <div className="space-y-6">
                                {editingContent === "lesson" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Lesson Content
                                </h3>
                                {editingContent === "lesson" ? (
                                    <textarea
                                        value={contentData.lessonIntro}
                                        onChange={(e) =>
                                            updateContent(
                                                "lessonIntro",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                ) : (
                                    <p className="leading-relaxed mb-4">
                                        {contentData.lessonIntro}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.lessonIntroScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                    
                                        </div>
                                        
                                    </p>
                                    
                                )}
                                <div className="space-y-6">
                                    {contentData.lessonPoints.map(
                                        (section, idx) => (
                                            <div
                                                key={idx}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-gray-50"
                                                } p-5 rounded-lg`}
                                            >
                                                {editingContent === "lesson" ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={
                                                                section.title
                                                            }
                                                            onChange={(e) =>
                                                                updateLessonPoint(
                                                                    idx,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg border mb-3 text-xl font-semibold ${
                                                                darkMode
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-300"
                                                            }`}
                                                        />
                                                        {section.content && (
                                                            <textarea
                                                                value={
                                                                    section.content
                                                                }
                                                                onChange={(e) =>
                                                                    updateLessonPoint(
                                                                        idx,
                                                                        "content",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                                                                    darkMode
                                                                        ? "bg-gray-800 border-gray-600"
                                                                        : "bg-white border-gray-300"
                                                                }`}
                                                                rows={3}
                                                            />
                                                        )}
                                                        <div className="ml-6 space-y-3 mt-3">
                                                            {section.subPoints.map(
                                                                (
                                                                    subPoint,
                                                                    subIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            subIdx
                                                                        }
                                                                        className={`${
                                                                            darkMode
                                                                                ? "bg-gray-800"
                                                                                : "bg-white"
                                                                        } p-3 rounded-lg`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-sm font-bold text-yellow-600">
                                                                                {String.fromCharCode(
                                                                                    97 +
                                                                                        subIdx
                                                                                )}

                                                                                .
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteLessonSubPoint(
                                                                                        idx,
                                                                                        subIdx
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-800"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "title",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point title"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm font-semibold ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                        <textarea
                                                                            value={
                                                                                subPoint.content
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "content",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point content"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                            rows={
                                                                                2
                                                                            }
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.scripture ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "scripture",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Scripture reference (optional)"
                                                                            className={`w-full px-3 py-1 rounded border text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    addLessonSubPoint(
                                                                        idx
                                                                    )
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                            >
                                                                <Plus
                                                                    size={14}
                                                                />{" "}
                                                                Add Sub-point
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="text-xl font-semibold mb-2">
                                                            {idx + 1}.{" "}
                                                            {section.title}
                                                        </h4>
                                                        {section.content && (
                                                            <p className="leading-relaxed mb-3">
                                                                {
                                                                    section.content
                                                                }
                                                            </p>
                                                        )}
                                                        {section.scriptures &&
                                                            section.scriptures
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {section.scriptures.map(
                                                                        (
                                                                            scripture
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    scripture
                                                                                }
                                                                                onClick={() =>
                                                                                    showBibleVersions(
                                                                                        scripture
                                                                                    )
                                                                                }
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-2 text-sm"
                                                                            >
                                                                                <BookOpen
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                {
                                                                                    scripture
                                                                                }
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        {section.subPoints &&
                                                            section.subPoints
                                                                .length > 0 && (
                                                                <ol className="list-[lower-alpha] ml-6 space-y-3 mt-3">
                                                                    {section.subPoints.map(
                                                                        (
                                                                            subPoint,
                                                                            subIdx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    subIdx
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        subPoint.title
                                                                                    }

                                                                                    :
                                                                                </strong>{" "}
                                                                                {
                                                                                    subPoint.content
                                                                                }
                                                                                {subPoint.scripture && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                subPoint.scripture
                                                                                            )
                                                                                                showBibleVersions(
                                                                                                    subPoint.scripture
                                                                                                );
                                                                                        }}
                                                                                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                                                    >
                                                                                        📖
                                                                                        Read{" "}
                                                                                        {
                                                                                            subPoint.scripture
                                                                                        }
                                                                                    </button>
                                                                                )}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ol>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "conclusion" && (
                            <div className="space-y-4">
                                {editingContent === "conclusion" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Conclusion
                                </h3>
                                {editingContent === "conclusion" ? (
                                    <textarea
                                        value={contentData.conclusion}
                                        onChange={(e) =>
                                            updateContent(
                                                "conclusion",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border text-lg ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed">
                                        {contentData.conclusion}
                                    </p>
                                )}
                                {contentData.conclusionScriptures &&
                                    contentData.conclusionScriptures.length >
                                        0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.conclusionScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
            

                       











                       
                        {activeTab === "prayer" && (
                            <div className="space-y-4">
                                {editingContent === "prayer" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-6">
                                    Prayer Points
                                </h3>
                                {contentData.prayerPoints.map((prayer, idx) => (
                                    <div
                                        key={idx}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-gradient-to-r from-purple-50 to-pink-50"
                                        } p-6 rounded-lg border-l-4 border-purple-600`}
                                    >
                                        {editingContent === "prayer" ? (
                                            <textarea
                                                value={prayer}
                                                onChange={(e) =>
                                                    updatePrayerPoint(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-lg leading-relaxed">
                                                {prayer}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {editingContent === "prayer" && (
                                    <button
                                        onClick={addPrayerPoint}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Prayer Point
                                    </button>
                                )}
                            </div>
                        )}
                        {activeTab === "manage" && isPaid && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Manage Scriptures
                                    </h3>
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className={`${
                                            editMode
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        } text-white px-4 py-2 rounded-lg transition flex items-center gap-2`}
                                    >
                                        {editMode ? (
                                            <>
                                                <X size={16} /> Cancel
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={16} /> Add New
                                            </>
                                        )}
                                    </button>
                                </div>
                                {editMode && (
                                    <div
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-blue-50"
                                        } p-6 rounded-lg space-y-4`}
                                    >
                                        <input
                                            type="text"
                                            value={newVerse.reference}
                                            onChange={(e) =>
                                                setNewVerse({
                                                    ...newVerse,
                                                    reference: e.target.value,
                                                })
                                            }
                                            placeholder="Scripture Reference (e.g., John 3:16)"
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                        />
                                        {(
                                            [
                                                "KJV",
                                                "NKJV",
                                                "NIV",
                                                "ESV",
                                                "AMP",
                                                "NLT",
                                            ] as const
                                        ).map((version) => (
                                            <div key={version}>
                                                <label className="block font-semibold mb-2">
                                                    {version}
                                                </label>
                                                <textarea
                                                    value={
                                                        newVerse.versions[
                                                            version
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateVerseVersion(
                                                            version,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Enter ${version} text...`}
                                                    rows={3}
                                                    className={`w-full px-4 py-2 rounded-lg border ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addNewScripture}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Scripture
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {Object.keys(scriptureDB).map(
                                        (reference) => (
                                            <div
                                                key={reference}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-white border border-gray-200"
                                                } p-4 rounded-lg`}
                                            >
                                                <h4 className="font-bold text-lg mb-2">
                                                    {reference}
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            reference
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View All Versions →
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "manage" && !isPaid && (
                            <div className="text-center py-12">
                                <Lock
                                    size={64}
                                    className="mx-auto mb-4 text-purple-400"
                                />
                                <h3 className="text-2xl font-bold mb-4">
                                    Premium Feature
                                </h3>
                                <p className="mb-6">
                                    Upgrade to Premium to access scripture
                                    management
                                </p>
                                <button
                                    onClick={() => setShowPaymentGate(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                                >
                                    Unlock Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showVerseModal && selectedVerse && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowVerseModal(false)}
                >
                    <div
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    {selectedVerse}
                                </h3>
                                <button
                                    onClick={() => setShowVerseModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            {(
                                [
                                    "KJV",
                                    "NKJV",
                                    "NIV",
                                    "ESV",
                                    "AMP",
                                    "NLT",
                                ] as const
                            ).map((version) => (
                                <button
                                    key={version}
                                    onClick={() => changeBibleVersion(version)}
                                    disabled={verseLoading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                                        bibleVersion === version
                                            ? "bg-blue-600 text-white"
                                            : darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    } ${
                                        verseLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                        <div
                            className="p-6 overflow-y-auto"
                            style={{ maxHeight: "calc(85vh - 180px)" }}
                        >
                            {verseLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-500 animate-pulse">
                                        Loading scripture...
                                    </p>
                                </div>
                            ) : selectedVerse &&
                              scriptureDB[selectedVerse] &&
                              scriptureDB[selectedVerse][bibleVersion] ? (
                                <div className="text-lg leading-relaxed animate-fadeIn">
                                    {formatScriptureText(
                                        scriptureDB[selectedVerse][bibleVersion]
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Translation not available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SundaySchoolApp;
