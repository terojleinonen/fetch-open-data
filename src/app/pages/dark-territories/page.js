// src/app/pages/dark-territories/page.js
import Link from 'next/link';
import { useEffect } from 'react'; // Add useEffect

export default function DarkTerritoriesPage() {

  const locationData = {
    'location-derry': {
      title: 'Derry',
      description: 'An idyllic facade veils a deep-seated darkness, where childhood fears manifest and ancient evils awaken.',
      works: ['It', 'Insomnia', '11/22/63'],
    },
    'location-castlerock': {
      title: 'Castle Rock',
      description: 'A quintessential New England town where ordinary lives collide with the extraordinarily sinister, often tearing the community apart.',
      works: ['The Dead Zone', 'Cujo', 'Needful Things'],
    },
    'location-jerusalemslot': {
      title: 'Jerusalem\'s Lot',
      description: 'Once a pious settlement, now a place of forsaken faith, where shadows lengthen and an unholy thirst corrupts the night.',
      works: ['\'Salem\'s Lot', '"Jerusalem\'s Lot" (story)'],
    },
    'location-haven': {
      title: 'Haven',
      description: 'The unsettling quiet of this isolated town masks an alien influence, subtly warping minds and bodies from a long-buried secret.',
      works: ['The Tommyknockers'],
    },
    'location-littletallisland': {
      title: 'Little Tall Island',
      description: 'Cut off by the sea, this remote island community harbors deep secrets and becomes a crucible when confronted by storms, both natural and malevolent.',
      works: ['Dolores Claiborne', 'Storm of the Century'],
    },
  };

  useEffect(() => {
    const infoPanel = document.getElementById('info-panel');
    const infoPanelTitle = document.getElementById('info-panel-title');
    const infoPanelDescription = document.getElementById('info-panel-description');
    const infoPanelWorks = document.getElementById('info-panel-works'); // Corrected variable name
    const infoPanelClose = document.getElementById('info-panel-close');

    // Define event handler functions to allow for proper removal
    const markerClickHandlers = {};

    const showInfoPanel = (data, targetElement) => {
      if (infoPanelTitle) infoPanelTitle.textContent = data.title;
      if (infoPanelDescription) infoPanelDescription.textContent = data.description;
      if (infoPanelWorks) { // Corrected variable name usage
        infoPanelWorks.innerHTML = ''; // Clear previous works
        data.works.forEach(work => {
          const li = document.createElement('li');
          li.textContent = work;
          infoPanelWorks.appendChild(li);
        });
      }
      if (infoPanel) {
          infoPanel.style.display = 'block';
          const markerRect = targetElement.getBoundingClientRect();
          // Get the map container's bounding rect. The panel's parentElement is the map container.
          const mapContainerRect = infoPanel.parentElement.getBoundingClientRect();

          let top = markerRect.top - mapContainerRect.top + markerRect.height / 2;
          let left = markerRect.left - mapContainerRect.left + markerRect.width + 15;

          // Adjust if panel would go off-screen (simple boundary check)
          // Check right boundary
          if (left + infoPanel.offsetWidth > infoPanel.parentElement.offsetWidth) {
              left = markerRect.left - mapContainerRect.left - infoPanel.offsetWidth - 15;
          }
          // Check bottom boundary
          if (top + infoPanel.offsetHeight > infoPanel.parentElement.offsetHeight) {
              top = markerRect.top - mapContainerRect.top - infoPanel.offsetHeight + markerRect.height / 2;
          }
          // Check left boundary (if flipped)
          if (left < 0) {
              left = 10; // Fallback position
          }
          // Check top boundary
          if (top < 0) {
              top = 10; // Fallback position
          }

          infoPanel.style.top = `${top}px`;
          infoPanel.style.left = `${left}px`;
      }
    };

    const hideInfoPanel = () => {
      if (infoPanel) infoPanel.style.display = 'none';
    };

    Object.keys(locationData).forEach(locationId => {
      const marker = document.getElementById(locationId);
      if (marker) {
        // Store the handler function so it can be removed later
        markerClickHandlers[locationId] = (event) => {
          showInfoPanel(locationData[locationId], event.target);
        };
        marker.addEventListener('click', markerClickHandlers[locationId]);
      }
    });

    if (infoPanelClose) {
      infoPanelClose.addEventListener('click', hideInfoPanel);
    }

    return () => {
      Object.keys(locationData).forEach(locationId => {
        const marker = document.getElementById(locationId);
        if (marker && markerClickHandlers[locationId]) {
          marker.removeEventListener('click', markerClickHandlers[locationId]);
        }
      });
      if (infoPanelClose) {
        infoPanelClose.removeEventListener('click', hideInfoPanel);
      }
    };
  }, []); // Empty dependency array: runs once on mount, cleans up on unmount

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-[var(--text-color)] px-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Dark Territories
        </h1>
        <p className="text-lg md:text-xl" style={{ fontFamily: 'Georgia, serif' }}>
          An interactive exploration of the Stephen King universe.
        </p>
        <p className="text-md md:text-lg mt-2 italic" style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-color)' }}>
          (Coming Soon)
        </p>
      </header>

      {/* Container for the map */}
      <div className="relative w-full max-w-4xl mx-auto my-8 p-4 rounded" style={{ backgroundColor: 'var(--background-color)' }}> {/* Added 'relative' for positioning context */}
        <svg
          width="100%"
          viewBox="0 0 1000 750"
          className="block" // block is good, mx-auto is handled by parent
          aria-label="Interactive Map of Stephen King's Universe"
          style={{ border: '1px solid var(--accent-color)' }} // Temporary border to visualize
        >
          <rect x="0" y="0" width="1000" height="750" fill="#101010" />

          {/* Key Locations Markers */}
          {/* Derry (fairly central) */}
          <circle id="location-derry" className="map-marker" cx="500" cy="350" r="15" />

          {/* Castle Rock (west of Derry) */}
          <circle id="location-castlerock" className="map-marker" cx="300" cy="450" r="15" />

          {/* Jerusalem's Lot (north-east of Derry, more isolated) */}
          <circle id="location-jerusalemslot" className="map-marker" cx="700" cy="200" r="15" />

          {/* Haven (south-west, coastal feel) */}
          <circle id="location-haven" className="map-marker" cx="350" cy="600" r="15" />

          {/* Little Tall Island (far east, island feel) */}
          <circle id="location-littletallisland" className="map-marker" cx="850" cy="500" r="15" />

          {/* Future map elements will go here */}
        </svg>

        {/* Pop-up/Info Panel Structure */}
        <div
          id="info-panel"
          className="absolute p-6 rounded shadow-lg"
          style={{
            display: 'none', // Hidden by default
            fontFamily: 'Georgia, serif',
            backgroundColor: '#181818', // Very dark gray, slightly lighter than map
            color: 'var(--text-color)',
            border: '1px solid var(--accent-color)',
            width: '300px', // Or a suitable width
            // Positioning will be handled by JavaScript, or set initial top/left if needed
            // For now, let's assume JS will position it.
            // Add a high z-index to ensure it's above the SVG, though sibling order might handle this too.
            zIndex: 10,
          }}
        >
          <h2 id="info-panel-title" className="text-2xl mb-2" style={{ color: 'var(--accent-color)' }}>
            {/* Location Name */}
          </h2>
          <p id="info-panel-description" className="text-sm mb-3">
            {/* Thematic Description */}
          </p>
          <div>
            <h3 className="text-md mb-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              {/* "Echoes From:" or similar subtitle */}
              Echoes From:
            </h3>
            <ul id="info-panel-works" className="list-disc list-inside text-sm pl-2">
              {/* Associated Works will be list items <li> */}
            </ul>
          </div>
          <button
            id="info-panel-close"
            className="absolute top-2 right-3 text-xl"
            style={{ color: 'var(--text-color)', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Close panel"
          >
            &times; {/* Simple 'x' for close */}
          </button>
        </div>
      </div>

      <Link href="/" className="home-link text-xl mt-12">
        Return to Home
      </Link>
    </div>
  );
}
