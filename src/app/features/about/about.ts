import { Component } from '@angular/core';

interface Pillar {
  title: string;
  text: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly pillars: Pillar[] = [
    {
      title: 'Data',
      text: 'Every selection starts from statistics, not from a favourite team or a gut feeling.',
    },
    {
      title: 'Form',
      text: 'Recent results, home and away splits, and head-to-head trends all factor into a pick.',
    },
    {
      title: 'Value',
      text: 'We look for odds that undervalue the true probability of an outcome, not just short-priced favourites.',
    },
    {
      title: 'Discipline',
      text: 'A consistent process, staked sensibly, published ahead of kickoff — never chasing losses.',
    },
    {
      title: 'Transparency',
      text: 'Every published ticket is graded and kept in the public archive, whether it wins or loses.',
    },
  ];
}
