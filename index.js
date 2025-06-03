import * as d3 from 'd3';
import f3 from 'family-chart';
import 'family-chart/styles/family-chart.css';

// Importing all JavaScript files in src/view and src/view/elements
import { createChart } from './src/createChart.js';
import { createStore } from './src/createStore.js';
import { handlers } from './src/handlers.js';
import { elements } from './src/elements.js';
import { view } from './src/view.js';

// Import all view.js files
import './src/view/view.cards.js';
import './src/view/view.handlers.js';
import './src/view/view.html.cards.js';
import './src/view/view.html.component.js';
import './src/view/view.html.handlers.js';
import './src/view/view.links.js';
import './src/view/view.svg.js';

// Import all elements.js files
import './src/view/elements/Card.defs.js';
import './src/view/elements/Card.elements.js';
import './src/view/elements/Card.icons.js';
import './src/view/elements/Card.js';
import './src/view/elements/Card.templates.js';
import './src/view/elements/CardHtml.js';
import './src/view/elements/Form.js';
import './src/view/elements/Link.js';

fetch('https://donatso.github.io/family-chart-doc/data/data-staljin.json')
  .then(res => res.json())
  .then(data => create(data))
  .catch(err => console.error(err));

function create(data) {
  const cont = document.querySelector("div#FamilyChart");
  const store = f3.createStore({
    data,
    node_separation: 250,
    level_separation: 150
  });

  const svg = f3.createSvg(cont);
  const Card = f3.elements.Card({
    store,
    svg,
    card_dim: {w:220, h:70, text_x:75, text_y:15, img_w:60, img_h:60, img_x:5, img_y:5},
    card_display: [d => d.data.label || '', d => d.data.desc || ''],
    mini_tree: true,
    link_break: false
  });

  store.setOnUpdate(props => f3.view(store.getTree(), svg, Card, props || {}));
  store.updateTree({initial: true});

  // Hover and Card Click Events
  svg.selectAll('.f3-card')
    .on('mouseover', function(event, d) {
      d3.select(this).style('transform', 'scale(1.1)');
    })
    .on('mouseout', function(event, d) {
      d3.select(this).style('transform', 'scale(1)');
    })
    .on('click', function(event, d) {
      displayPopup(d);
    });

  svg.selectAll('.f3-link')
    .on('mouseover', function(event, d) {
      d3.select(this).style('stroke', 'red').style('stroke-width', 3);
    })
    .on('mouseout', function(event, d) {
      d3.select(this).style('stroke', 'black').style('stroke-width', 1);
    });

  setTimeout(() => {
    const tree = store.getTree();
    const datum = tree.data[Math.floor(tree.data.length * Math.random())];  // Random card
    f3.handlers.cardToMiddle({datum, svg, svg_dim: svg.getBoundingClientRect(), transition_time: 2000});
  }, 4000);
}

function displayPopup(data) {
  const popup = document.getElementById("popupContainer");
  document.getElementById("popupName").innerText = `Name: ${data.data.label || 'N/A'}`;
  document.getElementById("popupRelationship").innerText = `Relationship: ${data.data.desc || 'N/A'}`;
  document.getElementById("popupDescription").innerText = `Description: ${data.data.description || 'No description available'}`;
  popup.style.display = 'block';
}
