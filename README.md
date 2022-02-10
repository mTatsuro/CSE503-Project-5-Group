# CSE330

Tatsuro Murakami

Student ID: 491963

Username: mTatsuro

Access the website from here: http://ec2-18-118-2-214.us-east-2.compute.amazonaws.com/~tatsuro/module5/calendar.html

## How to use the website
### Log in
Once you access the above URL, you are presented with our calendar. Initially, you do not see any events as you are not logged in. You can either log in from the upper right corner of the website or register from the form below the calendar. Here are some existing (username, password) combinations with some events: **(wustl, 1853)**, (Eve, password), (Bob, 12345), (tatsuro, tatsuro). We recommned to use **(wustl, 1853)** as the username is filled with most events, especially in July 2021. Once you are registered or logged in, we recommend you to move to the next or previous month and come back so that the changes caused by logging in is properly reflected on the calendar.

### Calendar
Above the calendar, you see the year and the month of currently displayed calendar. Each date and weekday is matched to the reality. Next to those, there are previous and next buttons, each moves the display to the previous and the next month.

### Events
On the calendar, you see clickable red ! sign on a day. This represents that there is an event associated with your username on the day. Once you click it, you see the list of events of the day. Each event shows its title and time along with delete and edit buttons. You can close the list of events on this day by clicking the ! sign again.  Once you click the delete button, you delete the event instantly. If you click the edit button, a small editor pops up in the bottom left corner which allows you to make changes to the event. Once you are done with editing, click the save button. If you decide not to make a change, you can click the close button to close the editor. Below the registration form, you can find our event creation form. You can specify the title, time, and date of the event, and save it by clicking the save button. Note that any changes you make be it delete, edit, or create, we recommend to move to another month and come back to see the changes.

## Creative Portion
### Tags
We implemented the tag feature to our calendar. Users can create events with one of 6 color tags with initial tag color set to white. Those tag colors are displayed next to the title of each event in the event list. Users can also edit the color tag of each event in our editor. Moreover, we added the filter events by tag colors feature to our calendar. Above the calendar, you see tag names with checkboxes. They are initially all checked, and by unselecting a tag, the events with the unselected tag disappear from the calendar view and the list of events. As these events are not really deleted from the database, you can check and uncheck multiple times to make sure you choose right tags to display.

### Sharing events
We implemented the sharing events with other users feature. When you create an event, you have a choice of sharing it with another user by entering the username of the user you want to share the event with. The share event appears on another user's calendar with the red text "shared", indicating that the event is shared and cannot be modified or deleted by the user. Shared events do not have delete and edit buttons unless the logged in user is the owner of the events. Users can tag shared events just as normal events and even non-owners can filter shared events by tag color in their calendar views.

### Correct initial month
We also implemented the feature which makes sure that the current month in the real world is displayed initially on the calendar. Also, today in the real world is marked with grey background color of its cell. This makes sure that when users first visit this website, they see the actual current month and the actual today at the first glance. 
