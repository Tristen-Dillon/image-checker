import fs from 'fs';
import path from 'path';
import { FileProvider } from '@/context/file-context';
import ViewerComponent from '@/components/viewer-component';
async function getFiles() {
  const dir = path.join(process.cwd(), 'public', 'files');
  const allFiles = fs.readdirSync(dir);

  const images = allFiles.filter(file => {
    const ext = file.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext!);
  });
  const pdfs = allFiles.filter(file => {
    const ext = file.toLowerCase().split('.').pop();
    return ext === 'pdf';
  });

  // images first, then pdfs
  return images.concat(pdfs);
}

type SearchParams = Promise<{ start: number, end: number }>

interface HomeProps {
  searchParams: SearchParams;
}
export default async function Home({ searchParams }: HomeProps) {
  const files = await getFiles();
  const sp = await searchParams
  const sliced = files.slice(sp.start || 0, sp.end ?? files.length - 1)
  return (
    <FileProvider initialFiles={sliced} >
      <ViewerComponent />
    </FileProvider>
  );
}