import { DocumentDto } from '@/lib/dto/document.dto';
import { ImageResponse } from 'next/og';
import React from 'react';

interface OpenGraphImageProps {
  document: DocumentDto;
}

export default function OpenGraphImage({ document }: OpenGraphImageProps) {
  const size = {
    width: 1200,
    height: 630,
  };

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: 'white',
          width: '100%',
          height: '100%',
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '5%',
            left: '2%',
            gap: '20px',
          }}
        >
          <svg
            width="100px"
            height="100px"
            viewBox="0 0 300 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m152.5,13.5c34.6,15.26 69.27,30.42 104,45.5c1.33,1.67 1.33,3.33 0,5c-25.29,10.31 -50.63,20.64 -76,31c-16.22,6.95 -32.89,8.28 -50,4c-19.47,-6.77 -38.47,-14.6 -57,-23.5c-0.71,-0.9 -1.71,-1.24 -3,-1c-0.33,14.51 0,28.84 1,43c1.87,0.36 3.37,1.36 4.5,3c0.5,16 0.67,32 0.5,48c-5.59,0.31 -11.09,-0.03 -16.5,-1c-0.67,-15.33 -0.67,-30.67 0,-46c1.33,-1.33 2.67,-2.67 4,-4c0.5,-15.33 0.67,-30.66 0.5,-46c-6.95,-1.64 -13.61,-4.14 -20,-7.5c-1.33,-1.67 -1.33,-3.33 0,-5c33.49,-15.42 67.16,-30.25 101,-44.5c2.36,-0.17 4.69,-0.51 7,-1z"
              fill="#87CEEB"
            />
            <path
              d="m98.5,98.5c11.8,4.32 23.8,8.16 36,11.5c10.33,0.67 20.67,0.67 31,0c11.76,-3.03 23.26,-6.86 34.5,-11.5c1.6,0.6 2.94,1.6 4,3c12.24,21.03 12.57,42.36 1,64c-7.46,10.81 -14.13,22.15 -20,34c-1.92,5.15 -2.92,10.48 -3,16c-1.48,3.16 -3.98,5 -7.5,5.5c-16.67,0.67 -33.33,0.67 -50,0c-2.5,-1.17 -4.33,-3 -5.5,-5.5c-0.02,-7.39 -1.69,-14.39 -5,-21c-4.83,-9 -10.17,-17.67 -16,-26c-13.95,-23.63 -13.78,-46.97 0.5,-70z"
              fill="#338EF7"
            />
            <path
              d="m123.5,228.5c18,-0.17 36,0 54,0.5c3.92,2.82 3.92,5.82 0,9c-18.34,0.83 -36.68,0.67 -55,-0.5c-2.84,-3.38 -2.51,-6.38 1,-9z"
              fill="#87CEEB"
            />
            <path
              d="m122.5,243.5c18.67,-0.17 37.34,0 56,0.5c2.81,3.29 2.48,6.29 -1,9c-18,0.67 -36,0.67 -54,0c-3.54,-2.87 -3.88,-6.04 -1,-9.5z"
              fill="#87CEEB"
            />
            <path
              d="m122.5,258.5c18.67,-0.17 37.34,0 56,0.5c1.48,2.59 1.15,4.92 -1,7c-3.78,1.83 -7.78,2.83 -12,3c-1.22,3.57 -2.89,6.9 -5,10c-6.67,0.67 -13.33,0.67 -20,0c-2.47,-2.94 -4.14,-6.27 -5,-10c-5.24,0.44 -9.74,-1.06 -13.5,-4.5c-0.68,-2.1 -0.51,-4.1 0.5,-6z"
              fill="#87CEEB"
            />
          </svg>
          <div style={{ fontSize: 72, display: 'flex' }}>
            <span style={{ color: '#338EF7' }}>Edu</span>
            <span style={{ color: '#005BC4' }}>GlowUp</span>
          </div>
        </div>
        <div
          style={{
            fontSize: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            textAlign: 'center',
          }}
        >
          {document.filename}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
