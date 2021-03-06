# WRBot

## What is it ?

WRBot displays the world record of the category you're running by looking at your stream title. You can specify which string it has to detect for each category you're running.

## How to install ?

- Create a new project on glitch.com and import the content of this git (https://github.com/loVimien/World-Record-Bot)
- Setup the environement
  - BOT_USERNAME : Set the bot username (You can use your twitch account or create another one)
  - OAUTH_TOKEN : Set the oAuth key (you can generate one on https://twitchapps.com/tmi/. It has to correspond to the bot account)
  - CHANNEL_NAME : Set the channel where the bot will be deployed
 
 If there's updates, reimport the content of the git on glitch.com.

## How to use ?

### Moderator commands

- Add WR

```
!wrAdd|SRC_API_Category_Link|Display_name_on_title|Subcategory(if you want to add one)
```

    * SRC_API_Category_Link : This is a link like this : https://www.speedrun.com/api/v1/leaderboards/game_name/category/category_name. For example for Ocarina of Time MST it will be https://www.speedrun.com/api/v1/leaderboards/oot/category/mst
    * Display_name_on_title : Part of the stream title which the bot uses to know which WR it has to display
    * Subcategory : If you want to get a WR for a subcategory on SRC, type the exact name of the subcategory

- WR List

```
!wrList
```

- WR remove

```
!wrRemove|wr_index
```

    * wr_index : Index shown with the comment !wrList
    
## Public command
People in the chat just have to type 
```
!wr 
```
to get the WR of the category you're running
