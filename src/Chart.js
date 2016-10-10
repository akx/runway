import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine} from 'recharts';

export default ({data}) => (
  <LineChart width={1000} height={250} data={data}>
    <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toISOString().split('T')[0]} minTickGap={1} />
    <YAxis />
    <CartesianGrid strokeDasharray="3 3"/>
    <Tooltip />
    <ReferenceLine y={0} label="Dead" stroke="red" strokeDasharray="3 3" />
    <Line dataKey="cumulative" stroke="#8884d8" isAnimationActive={false} />
  </LineChart>
);
