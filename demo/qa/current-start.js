async(page) => {
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  await page.goto('http://127.0.0.1:8767/variants/current-mobile/index.html');
  await page.setViewportSize({width:334,height:732});
  await page.getByRole('button',{name:'Меню',exact:true}).click();
  await page.getByRole('button',{name:'Внесение визитов',exact:true}).click();
  await page.getByRole('button',{name:'Аудит по Безопасности пищи New ›',exact:true}).click();
  await page.getByRole('button',{name:'Заполнить визит',exact:true}).click();
  assert(await page.locator('#visit-required').isVisible(),'Empty PBO accepted');
  await page.getByRole('button',{name:'Открыть календарь',exact:true}).click();
  await page.getByRole('button',{name:'Следующий месяц',exact:true}).click();
  assert((await page.locator('#calendar-month').innerText()).includes('октябрь'),'Calendar next month');
  await page.getByRole('button',{name:'Предыдущий месяц',exact:true}).click();
  await page.getByRole('button',{name:'22',exact:true}).click();
  await page.locator('#pbo-trigger').click();
  await page.locator('#pbo-query').fill('ничего-не-найдётся');
  assert(await page.locator('#pbo-search-body tr').count()===0,'PBO filter did not filter');
  await page.locator('#pbo-query').fill('333');
  await page.getByRole('cell',{name:'3333333 Test Hub',exact:true}).click();
  await page.locator('#checklist-link').click();
  await page.getByRole('button',{name:'Смотреть вопросы чек-листа',exact:true}).click();
  assert((await page.locator('#checklist-preview-body').innerText()).includes('22. FS'),'Preview incomplete');
  await page.locator('[data-screen="checklist-preview"] [data-go="checklist-meta"]').click();
  await page.locator('[data-action="back-to-modal"]').click();
  assert(await page.locator('#visit-pbo').inputValue()==='3333333 Test Hub','PBO lost after metadata');
  await page.getByRole('button',{name:'Заполнить визит',exact:true}).click();
  await page.locator('[data-task="form-food"]').click();
  await page.locator('[data-screen="agreement-food"].active').waitFor();
  await page.locator('[data-action="agree-food"]').click();
  await page.locator('[data-task="form-food"]').click();
  await page.locator('[data-screen="form-food"].active').waitFor();
  await page.screenshot({path:'output/playwright/current-form.png'});
  return {status:'PASS',checks:['empty PBO','calendar','search','metadata roundtrip','consent through tasks']};
}

