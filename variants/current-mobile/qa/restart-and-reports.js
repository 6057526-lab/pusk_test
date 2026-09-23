async(page) => {
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  await page.getByRole('button',{name:'Завершить процесс',exact:true}).click();
  assert(await page.locator('[data-task="results-food"]').count()===0,'Result task not closed');
  await page.locator('[data-screen="tasks"] [data-action="open-menu"]').click();
  await page.getByRole('button',{name:'Отчеты по визитам',exact:true}).click();
  await page.locator('[data-screen="reports"] [data-action="open-report-pbo-search"]').click();
  await page.locator('#report-pbo-query').fill('333');
  await page.locator('#report-pbo-search-body tr').first().click();
  assert(await page.locator('#report-filter-chip').isVisible(),'Report filter not set');
  assert(await page.locator('#reports-pbo-list .pbo-link').count()===1,'Report filter wrong');
  await page.locator('#reports-pbo-list .pbo-link').click();
  assert((await page.locator('#pbo-details').innerText()).includes('29 апреля 2026'),'PBO card missing metadata');
  await page.locator('[data-screen="pbo-card"] [data-go="reports"]').click();
  await page.locator('[data-action="clear-report-filter"]').click();
  assert(await page.locator('#reports-pbo-list .pbo-link').count()>1,'Report filter not cleared');
  await page.locator('[data-screen="reports"] [data-action="open-report-pbo-search"]').click();
  await page.locator('#report-pbo-query').fill('24201');
  await page.locator('#report-pbo-search-body tr').first().click();
  assert(await page.locator('[data-screen="access-denied"].active').isVisible(),'Access denied missing');
  await page.getByRole('button',{name:'Закрыть',exact:true}).click();
  await page.locator('[data-action="close-report-pbo-search"]').click();
  await page.locator('[data-screen="reports"] [data-action="open-menu"]').click();
  await page.getByRole('button',{name:'Внесение визитов',exact:true}).click();
  await page.getByRole('button',{name:'Аудит по Безопасности пищи New ›',exact:true}).click();
  await page.locator('#visit-date').fill('23.09.2026');
  await page.locator('#pbo-trigger').click();
  await page.getByRole('cell',{name:'26511 Лакинск',exact:true}).click();
  await page.getByRole('button',{name:'Заполнить визит',exact:true}).click();
  await page.locator('[data-task="form-food"]').click();
  await page.locator('[data-screen="agreement-food"].active').waitFor();
  await page.locator('[data-action="agree-food"]').click();
  assert((await page.locator('[data-task="form-food"]').innerText()).includes('26511 Лакинск'),'Task ignored PBO');
  await page.locator('[data-task="form-food"]').click();
  await page.locator('[data-screen="form-food"].active').waitFor();
  assert(await page.locator('#food-form-body input:checked').count()===0,'New visit inherited answers');
  assert(await page.locator('#food-form-body textarea').first().inputValue()==='','New visit inherited comments');
  for(const [width,height] of [[334,732],[390,664],[406,864]]){
    await page.setViewportSize({width,height});
    const footer=await page.locator('[data-screen="form-food"] .sticky-footer').boundingBox();
    assert(footer.y+footer.height<=height+1,'Footer outside viewport');
    await page.screenshot({path:`output/playwright/form-${width}.png`});
  }
  return {status:'PASS',checks:['close process','report filter','PBO metadata','access denied','new visit clean state','selected PBO','334/390/406 widths']};
}
