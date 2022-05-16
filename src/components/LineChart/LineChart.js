import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { AreaChart,Area,XAxis,YAxis, ResponsiveContainer } from 'recharts'
const oracleUrl = process.env.REACT_APP_ORACLE_HTTP_URL

export default function LineChart({ symbol,color }) {
  const [data, setData] = useState([])
  const now = new Date().getTime();
  const from = parseInt((now - 1000 * 60 * 60 * 24) / 1000);
  const to = parseInt(now / 1000);
  const loadData = async () => {
    const url = `${oracleUrl}/get_kline`
    const res = await axios.get(url,{
      params : {
        symbol : symbol,
        time_type: 'hour',
        from : from ,
        to : to 
      }
    })
    if(res.status === 200 && res.data.data){
      const data = res.data.data.map(d => ({value : d.close,time : new Date(d.time).getHours()}))
      setData(data)
    }
  }

  useEffect(() => {
    loadData();
  }, [])

  return (data ?
    <ResponsiveContainer height={97}>
      <AreaChart width={376} data={data}>
        <defs>
          <linearGradient id="colorArea" x1="0" y1="1" x2="0" y2="0" >
            <stop offset="10%" stopColor={color} stopOpacity={0.1} />
            <stop offset="90%" stopColor={color} stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" hide={true} />
        <YAxis dataKey='value' hide={true}/>
        <Area type="monotone" dataKey="value" stroke={color} fillOpacity={0.5} strokeWidth={3} fill="url(#colorArea)" />
      </AreaChart>
    </ResponsiveContainer>
    : null)
}