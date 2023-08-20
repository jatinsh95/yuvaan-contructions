$(".sec-home").addClass("active");

$(".sec-home").click(function () {
  $(".nav-wrapper ul li").children().removeClass("active");
  $(this).addClass("active");
  $("html, body").animate(
    {
      scrollTop: $("#home").offset().top,
    },
    1000
  );
  return false;
});

$(".sec-about").click(function () {
  $(".nav-wrapper ul li").children().removeClass("active");
  $(this).addClass("active");
  $("html, body").animate(
    {
      scrollTop: $("#about").offset().top - 64,
    },
    1000
  );
  return false;
});

$(".sec-projects").click(function () {
  $(".nav-wrapper ul li").children().removeClass("active");
  $(this).addClass("active");
  $(" html,body").animate(
    {
      scrollTop: $("#projects").offset().top - 64,
    },
    1000
  );
  return false;
});

$(".sec-contact").click(function () {
  $(".nav-wrapper ul li").children().removeClass("active");
  $(this).addClass("active");
  $("html,body ").animate(
    {
      scrollTop: $("#contact").offset().top - 64,
    },
    1000
  );
  return false;
});

$("#about").waypoint(
  function () {
    $(".nav-wrapper ul li").children().removeClass("active");
    $(".sec-about").addClass("active");
  },
  { offset: 64 }
);

$("#projects").waypoint(
  function () {
    $(".nav-wrapper ul li").children().removeClass("active");
    $(".sec-projects").addClass("active");
  },
  { offset: "40%" }
);

$("#contact").waypoint(
  function () {
    $(".nav-wrapper ul li").children().removeClass("active");
    $(".sec-contact").addClass("active");
  },
  { offset: "70%" }
);

$("#home").waypoint(
  function () {
    $(".nav-wrapper ul li").children().removeClass("active");
    $(".sec-home").addClass("active");
  },
  { offset: -64 }
);

var navIcon = true;
function toggleNav(){
  if(this.navIcon == true){
    this.navIcon = false;
    document.getElementById("nav-open").classList.add("hide");
    document.getElementById("nav-close").classList.remove("hide")
    document.getElementById("nav-items").classList.remove("hide");
  }else{
    this.navIcon = true;
    document.getElementById("nav-close").classList.add("hide");
    document.getElementById("nav-open").classList.remove("hide")
    document.getElementById("nav-items").classList.add("hide");
  }
}