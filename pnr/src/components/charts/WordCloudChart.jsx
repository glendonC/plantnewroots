import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const WordCloudChart = ({ words }) => {
  const ref = useRef();

  useEffect(() => {
    const drawCloud = () => {
      if (!words.length) return;
      d3.select(ref.current).selectAll("*").remove();

      const layout = cloud()
        .size([1200, 800])
        .words(words.map(word => ({ text: word.text, size: word.size * 2 })))
        .padding(5)
        .rotate(() => Math.random() > 0.5 ? 0 : 90)
        .fontSize(d => d.size)
        .on('end', draw);

      layout.start();

      function draw(words) {
        const svg = d3.select(ref.current)
          .attr('width', layout.size()[0])
          .attr('height', layout.size()[1])
          .append('g')
          .attr('transform', `translate(${layout.size()[0] / 2}, ${layout.size()[1] / 2})`)
          .selectAll('text')
          .data(words)
          .enter().append('text')
          .style('font-size', d => `${d.size}px`)
          .style('font-family', 'Impact')
          .style('fill', (_, i) => d3.schemeTableau10[i % 10])
          .attr('text-anchor', 'middle')
          .attr('transform', d => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
          .text(d => d.text);
      }
    };

    drawCloud();
  }, [words]);

  return <svg ref={ref} />;
}

export default WordCloudChart;
