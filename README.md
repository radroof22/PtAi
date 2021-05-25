# PtAi
The inspiration for this project came out of the recent rise in tele-medicine and doctors appointments hosted over the internet. As such, I wanted to see if there was a way to bring physical therapy to the online world to help people at home get the most out of their workouts. Current products already exist that allow users to track their joint movements as they do a series as exercises, though these solutions are often expensive. Instead, a machine learning technique would allow the users to just need their phone to complete their assigned workouts and gain assistance from the model. 

## Awards
- 1st Place at Montgomery County Science Fair for Computer Science in 12th grade division
- 3rd Place at Delaware Valley Science Fair for Computer Science in 12th grade division

![Image of Bicep Curls using Pt.Ai](https://user-images.githubusercontent.com/23004551/119421930-d56dea00-bccd-11eb-9403-50926cb7993e.png)


## How to Run
`npm install`

`npm run develop`

## Goals
- Create website hosting pose estimation model
- Take camera input from the user's browser
- Feed camera input into ml5 pose estimation model
- Approximate freedom of motion / angle of joint using pose estimated points and the law of cosines
- Display live readings of the angle of motion for the user
- Count the number of reps the user completes

## Camera Feed
- The camera feed was obtained using p5.js
- Camera feed was then passed to PoseNet model wrapper from ml5
- Take joint values and return to angle calculator 

## Angle Calculator
- Use Euclidian Distance formula to find distance between two points on the 2d grid as approximated by PoseNet
- Use distances as input to law of cosines, which will output angle of that triangle formed by the three lines

## Rep Counter
- Through trial and error (as well as research on freedom of motion for joints) create breakpoints for the angle of the joint as approximated by PoseNet
- Create visual counter using p5 to count the number of reps

## **Note**: Side of the Body
- When switching arms, use "left" joints instead of "right" and likewise vice versa
- When deciding on both arms, make sure both body parts achieve the desired degree of motion

## Available Workouts
- Bicep Curls
- Shoulder Flexion
- Forward Bend
