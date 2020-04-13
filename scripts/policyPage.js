<script src="/s/jquerymin.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/findAndReplaceDOMText/0.4.6/findAndReplaceDOMText.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.1.0/papaparse.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/10.0.0/markdown-it.min.js"></script>
<!-- <script>$('#siteWrapper').hide()</script> !-->
<style>#page{visibility:hidden}</style>
<script>
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var md = window.markdownit();

function templateIfExists(key, value) {
  findAndReplaceDOMText(document.getElementById('page'), {
    preset: 'prose',
    find: '{{' + key + '}}', //replicate templating syntax
    replace: function replace(portion, match) {
      var el = document.createElement('span');
      el.innerHTML = md.renderInline(value)
      return el;
    }
  })
}

var codes={'arizona':'AZ','alabama':'AL','alaska':'AK','arkansas':'AR','california':'CA','colorado':'CO','connecticut':'CT','delaware':'DE','districtofcolumbia':'DC','florida':'FL','georgia':'GA','hawaii':'HI','idaho':'ID','illinois':'IL','indiana':'IN','iowa':'IA','kansas':'KS','kentucky':'KY','louisiana':'LA','maine':'ME','maryland':'MD','massachusetts':'MA','michigan':'MI','minnesota':'MN','mississippi':'MS','missouri':'MO','montana':'MT','nebraska':'NE','nevada':'NV','newhampshire':'NH','newjersey':'NJ','newmexico':'NM','newyork':'NY','northcarolina':'NC','northdakota':'ND','ohio':'OH','oklahoma':'OK','oregon':'OR','pennsylvania':'PA','rhodeisland':'RI','southcarolina':'SC','southdakota':'SD','tennessee':'TN','texas':'TX','utah':'UT','vermont':'VT','virginia':'VA','washington':'WA','westvirginia':'WV','wisconsin':'WI','wyoming':'WY',}

  var defaultData = {
    'State': 'massachusetts',
    'activismRating': '4',
    'stat1': 'Boston has reported a **22% increase** in domestic assault and battery reports in March compared to the same month last year. Shelters are still open, but cannot accept new victims.',
    'stat2': 'The Governor has declared a state of emergency in MA, **but has not dedicated any additional funds towards domestic violence.** No government websites list immediate next steps for abuse victims.',
    'govDirective': '**The MA Governor** must immediately **allocate emergency funding** to domestic violence shelters and hotlines.  A **website** must be created for domestic violence survivors to know the **exact steps to take.**',
    'legisDirective': '**The MA State Legislature** must enact a bill that establishes additional support services across the state. This includes **implementing emergency hotlines in supermarkets and pharmacies** for DV victims and individuals at risk for abuse. The state legislature must also provide **free remote mental health counseling for survivors.**',
    'judgeDirective': '**All presiding judges** must **extend the deadline for all Temporary Protective Orders** and implement **remote processes** for filing restraining orders. This process must be clearly indicated, such that those affected are easily able to **know the status of their legal cases.**',
    'proposalLink': 'https://docs.google.com/document/d/11m-vUD-zKTuZmG8cMOnRczebdLsI3zXgGSD_nHZptlM/edit?usp=sharing',
    'petitionLink': 'https://www.freedcovid19.org/massachusetts',
    'repTemplate': '[INSERT TEMPLATE EMAIL]',
  }

setTimeout(function(){ alert("After 5 seconds!"); }, 5000);

$( document ).ready(function() {

  findAndReplaceDOMText(document.getElementById('page'), {
    preset: 'prose',
    find: '/\{\{\w+\}\}/g', //replicate templating syntax
    replace: function replace(portion, match) {
      var el = document.createElement('span');
      el.innerHTML = match 
      el.hidden = true
      return el;
    }
  })

  console.log("ready!");
  var currState = getUrlParameter('state').toLowerCase()

  var statesLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-eX_8ToeSaXpXWbwIwhWggQWfJFgu7Il6_OXx300SeZueXi-FasnCcV2fy5diALDJXZEK1EsngF4Y/pub?gid=0&single=true&output=csv"
  Papa.parse(statesLink, {
    download: true,
    header: true,
    transform: function(value, header) {
      return (header != "State") ? value : value.replace(/\s+/g, '').toLowerCase();
    },
    complete: function(results) {
      //TODO: Handle errors and redirect if failure.
      var stateData;
      for (var row of results['data']) {
        if (row['State'] == currState) {
          stateData = row
          break;
        } 
      }
      templateIfExists('stateCode', codes[currState])
      for (var key in stateData) {
        var val = stateData[key];
        if (!val) {
          val = defaultData[key]
        }
        if (key.endsWith('Link')) {
          $('a[href^="{{' + key + '}}"]')[0].href = val //Links handled separately as edge case
        } else {
          templateIfExists(key, val);
        }
      }
      $('#page')[0].style.visibility = 'visible'
    }
  });

});

</script>
