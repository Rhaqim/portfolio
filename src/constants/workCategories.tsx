import WorkItem from '@/components/Work/WorkItem';
import { workExperiences } from './WorkExperience';
import { personalProjects } from './personalProjects';
import Projects from '@/components/Work/Projects';
import { opensourceProjects } from './opensource';

const workCategories = [
  {
    id: "work-experience",
    name: 'Work Experience',
    description: 'I owe a lot of my professional growth to these companies',
    image:
      'https://images.unsplash.com/photo-1680005084654-b57c0f6e5b77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80',
    duration: 2,
    content: (
      <div>
        {workExperiences.map((experience, index) => (
          <WorkItem key={index} {...experience} />
        ))}
      </div>
    ),
  },
  {
    id: "personal-projects",
    name: 'Personal Projects',
    description:
      "When I'm not working on client projects, I'm working on these",
    image:
      'https://images.unsplash.com/photo-1681163101469-5175a8925526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80',
    duration: 3,
    content: (
      <div>
        {personalProjects.map((project, index) => (
          <Projects key={index} {...project} />
        ))}
      </div>
    ),
  },
  {
    id: "open-source-projects",
    name: 'Open Source Projects',
    description: "I'm a big believer in open source software",
    image:
      'https://images.unsplash.com/photo-1672717892736-d3fcf1cd23c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
    duration: 4,
    content: (
      <div>
        {opensourceProjects.map((project, index) => (
          <Projects key={index} {...project} />
        ))}
      </div>
    ),
  },
];

export default workCategories;
