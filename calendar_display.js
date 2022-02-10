// This file handles visual bits of the calendar

// Month names to which convert javascript representation of a month
let monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

// For our purposes, we can keep the current month in a variable in the global scope
var today = new Date();
var currentMonth = new Month(today.getFullYear(), today.getMonth());

// Initial calendar display
document.addEventListener("DOMContentLoaded", updateCalendar, false);

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event){
  currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
  updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
  //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);


// Change the month when the "next" button is pressed
document.getElementById("prev_month_btn").addEventListener("click", function(event){
  currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
  updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
  //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);


// Add event listener to tag chooser
var tags = document.getElementsByClassName("chosen_tag");
var checked_colors = ["Red", "Green", "Yellow", "Blue", "Purple", "White"];
for (let i=0; i < tags.length; i++){
      tags[i].addEventListener("change", function(event){
        checked_colors = [];
        for (let j=0; j < tags.length; j++){
          if (tags[j].checked){
            checked_colors.push(tags[j].value);
          }
        }
        updateCalendar();
      }, false);
}


// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function updateCalendar(){
  var weeks = currentMonth.getWeeks();

  // Get events for this month
  updateEvents();
  const all_events = getEvents();
  let events = getEventsThisMonth(all_events);
  updateSharedEvents();
  const all_shared_events = getSharedEvents();
  let shared_events = getEventsThisMonth(all_shared_events);
  if (typeof events === 'object' && typeof shared_events === 'object'){   // Here to avoid errors when events are empty
    events = Object.assign(events, shared_events);
  }

  // Week 6 is usually empty unless the first day of a month is on Friday or Saturday
  document.getElementsByClassName("days")[5].innerHTML = "";

  var event_btn_ids = [];  // sets of event ids which have access button in this month

  for(var w in weeks){
    var days = weeks[w].getDates();
    // days contains normal JavaScript Date objects.

    //alert("Week starting on "+days[0]);
    document.getElementsByClassName("days")[w].innerHTML = "";

    for(var d in days){
      var cell_html_content = "<td>"+days[d].getDate();
      if (today.getDate() == days[d].getDate() && today.getMonth() == currentMonth.month && today.getFullYear() == currentMonth.year){    // Mark the day if it is today
        cell_html_content = '<td class="today">'+days[d].getDate();
      }
      // Go through the events of this month and check if there is any for this day
      for (const id in events){
        if (days[d].getDate() == events[id]["date"].slice(8, 10) && checked_colors.includes(events[id]["tag"])){
          cell_html_content += '<button id="event_' + id + '" class="event_btn">!</button>';
          cell_html_content += '<div id="popup_' + id + '" class="event_popup"></div>';
          event_btn_ids.push(id);
          break;  // Make sure the view events button appear once per day
        }
      }
      cell_html_content += "</td>";
      document.getElementsByClassName("days")[w].innerHTML += cell_html_content;
    }
  }

  // Add event listeners to each event button and fill the popup
  for (const id of event_btn_ids){
    // Find all the events on this day and put them on pupup
    document.getElementById("popup_"+id).insertAdjacentHTML( 'beforeend', "All events:<br>");
    for (const i in events){    // Here, i is the id of each event
      if (events[id]["date"] == events[i]["date"] && checked_colors.includes(events[i]["tag"])){
        let event_info = '<span class="dot" id="tag_' + i + '"></span>';
        event_info += "<strong>" + events[i]["title"] + "</strong>" + ": " + events[i]["time"].slice(0, 5) + " ";
        if (events[i]["id"] in shared_events){
          event_info += '<span class="shared_message">shared</span>';
        } else{
          event_info += '<button id="delete_' + i + '" value=' + i + ' class="event_delete_btn">Delete</button>';
          event_info += '<button id="edit_' + i + '" value=' + i + ' class="btn">Edit</button>' + "<br>";
        }
        document.getElementById("popup_"+id).insertAdjacentHTML( 'beforeend', event_info);      // Use insertAdjacentHTML instead of innerHTML so that event listener reference is not lost
        document.getElementById("tag_"+i).style.backgroundColor = events[i]["tag"];   // Set the color of a tag

        // Add event listeners only when events are of this user
        if (! (events[i]["id"] in shared_events)){
          // Delete event listener
          document.getElementById("delete_"+i).addEventListener("click", deleteEventAjax, false);
          // Display event editor
          document.getElementById("edit_"+i).addEventListener("click", function(event){
            document.getElementById("edit_form").style.display = "block";
            document.getElementById("edit_id").value = i;
            document.getElementById("edit_title").value = events[i]["title"];
            document.getElementById("edit_date").value = events[i]["date"];
            document.getElementById("edit_time").value = events[i]["time"];
            document.getElementById("edit_tag").value = events[i]["tag"];
          }, false);
        }
      }
    }
    // Add event listeners to the display button
    document.getElementById("event_"+id).addEventListener("click", function(event){
      if (document.getElementById("popup_"+id).style.display != "block"){    // The display button closes the form when clicked again
        document.getElementById("popup_"+id).style.display = "block";
      } else{
        document.getElementById("popup_"+id).style.display = "none";
      }
    }, false);
  }
  // Update HTML
  document.getElementById("month_name").textContent = monthNames[currentMonth.month];
  document.getElementById("year_name").textContent = currentMonth.year;
}


// Add event listener to close the editor button
document.getElementById("close_editor_btn").addEventListener("click", function(event){
  document.getElementById("edit_form").style.display = "none";
}, false);


// Returns events of this month
function getEventsThisMonth(events){
  const this_year = currentMonth.year;
  const this_month = currentMonth.month + 1; // +1 because months start from 0
  for (const id in events){
    // checking if the year and month is this year and month
    if (this_year+"-"+this_month != events[id]["date"].slice(0, 7) && this_year+"-0"+this_month != events[id]["date"].slice(0, 7)){
      delete events[id];
    }
  }
  return events;
}


// Calendar API retrieved from http://classes.engineering.wustl.edu/cse330/content/calendar.min.js
(function(){Date.prototype.deltaDays=function(c){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+c)};Date.prototype.getSunday=function(){return this.deltaDays(-1*this.getDay())}})();
function Week(c){this.sunday=c.getSunday();this.nextWeek=function(){return new Week(this.sunday.deltaDays(7))};this.prevWeek=function(){return new Week(this.sunday.deltaDays(-7))};this.contains=function(b){return this.sunday.valueOf()===b.getSunday().valueOf()};this.getDates=function(){for(var b=[],a=0;7>a;a++)b.push(this.sunday.deltaDays(a));return b}}
function Month(c,b){this.year=c;this.month=b;this.nextMonth=function(){return new Month(c+Math.floor((b+1)/12),(b+1)%12)};this.prevMonth=function(){return new Month(c+Math.floor((b-1)/12),(b+11)%12)};this.getDateObject=function(a){return new Date(this.year,this.month,a)};this.getWeeks=function(){var a=this.getDateObject(1),b=this.nextMonth().getDateObject(0),c=[],a=new Week(a);for(c.push(a);!a.contains(b);)a=a.nextWeek(),c.push(a);return c}};
