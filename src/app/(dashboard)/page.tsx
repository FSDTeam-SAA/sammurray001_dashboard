import React from 'react'
import OverviewCard from './_components/OverviewCard'
import { EarningChart } from './_components/EarningChart'
import RecentTransactions from './_components/RecentTransactions'

function page() {
  return (
    <div className=''>
     <OverviewCard />
     <div className='p-6'>
      <EarningChart />
     </div>
     <div className='p-6'>
      <RecentTransactions />
     </div>
    </div>
  )
}

export default page
