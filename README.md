### react pc 端项目

react + typescript + mobx

1. husky + prettier : 控制代码风格统一

2. 比较简单的模块可以尝试用函数组件 react-hooks

   - 尝试 comonents 下 组件部分迁移 hooks
   - page 下的组件 也可以进行尝试

3. mobx 管理数据流
    - redux 迁移 mobx 
    - mobx 添加逻辑代码

4. 合理分配 package.json 模块,开发环境和生产环境隔离开


### roadmap
ps. 你觉的哪些可以添加的在下列中添加你的想法

1. 代码规范 
    - 代码提交检测
    - 代码扫描检测
    - 代码提交会跑单元测试(push) 如果跑不过就不让提交

2. 提升代码质量 
    - 代码走读
    - 圈复杂度检测代码

3. 测试覆盖

   - 代码的可测性, 你的代码一定是可以测试的，如果测试很难写 需要你去优化代码
   - 测试代码的可读性
   - 单元测试覆盖率 50% 以上(分支/函数覆盖率),

4. 性能优化

    - lazy load (使用 Suspense + lazy 实现)
    - 首屏优化
    - webpack 打包优化
    - express 代理层优化 
    ...
```
web端性能添加工具google: Page Speed Score  可以检测你的页面优化的指标
1. express 添加gzip 压缩 
  const compression = require('compression')
  app.use(compression())

2. http response Connection: keep-alive  
```

5. web 端监控
    - 监控报错
    - 性能监控

6. scss module